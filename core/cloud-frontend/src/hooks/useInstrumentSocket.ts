import { useCallback, useEffect, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Subject, bufferTime } from "rxjs";
import { PriceUpdate } from "@/typings/RealtimePricing";
import { httpsToSocketUrl } from "@/utils/baseUrlFormatter";

type InstrumentId = number;

type SubscriptionAction = "subscribe" | "unsubscribe";

interface WSMessage {
  action: SubscriptionAction;
  instrument_id: number;
}

type PriceMessage = PriceUpdate;

export const useInstrumentSocket = ({
  url,
  instrumentIds,
  batchTimeMs = 5000,
}: {
  url: string;
  instrumentIds: number[];
  batchTimeMs?: number;
}) => {
  const [subscribedIds, setSubscribedIds] = useState<Set<InstrumentId>>(
    new Set()
  );
  const [serverData, setServerData] = useState<Record<number, PriceMessage[]>>(
    {}
  );
  const pendingQueue = useRef<WSMessage[]>([]);
  const reconnectFlag = useRef(false);

  const messageSubjectRef = useRef(new Subject<PriceMessage>());

  const { sendMessage, readyState } = useWebSocket(
    `${httpsToSocketUrl(import.meta.env.VITE_PUBLIC_API_URL)}${url}`,
    {
      shouldReconnect: () => true,
      reconnectAttempts: 10,
      reconnectInterval: 5000,

      onOpen: () => {
        if (reconnectFlag.current) {
          reconnectFlag.current = false;
          subscribedIds.forEach((id) => {
            sendJSON({ action: "subscribe", instrument_id: id });
          });
        }

        if (pendingQueue.current.length) {
          pendingQueue.current.forEach(sendJSON);
          pendingQueue.current = [];
        }
      },

      onMessage: (event) => {
        try {
          const data = JSON.parse(event.data);
          if ("price" in data && "instrument_id" in data) {
            const newPriceData: PriceMessage = {
              ...data,
            };

            messageSubjectRef.current.next(newPriceData);
          }
        } catch {
          console.log("Raw message:", event.data);
        }
      },

      onClose: () => {
        reconnectFlag.current = true;
      },

      onError: (e) => {
        console.error("❌ WebSocket error:", e);
      },
    }
  );

  useEffect(() => {
    const subscription = messageSubjectRef.current
      .pipe(bufferTime(batchTimeMs))
      .subscribe((batched) => {
        if (!batched.length) return;

        setServerData((prev) => {
          const newServerData = { ...prev };

          batched.forEach((socketEvent) => {
            const existingInstrumentData =
              newServerData[socketEvent.instrument_id] || [];

            const isDuplicate = existingInstrumentData.some(
              (existing) => existing.timestamp === socketEvent.timestamp
            );

            if (isDuplicate) return;

            newServerData[socketEvent.instrument_id] = [
              ...existingInstrumentData,
              socketEvent,
            ];
          });

          return newServerData;
        });
      });

    return () => subscription.unsubscribe();
  }, [batchTimeMs]);

  const sendJSON = useCallback(
    (msg: WSMessage) => {
      sendMessage(JSON.stringify(msg));
    },
    [sendMessage]
  );

  const subscribe = useCallback(
    (instrument_id: number) => {
      if (subscribedIds.has(instrument_id)) return;
      setSubscribedIds((prev) => new Set(prev).add(instrument_id));
      sendJSON({ action: "subscribe", instrument_id });
    },
    [subscribedIds, sendJSON]
  );

  const unsubscribe = useCallback(
    (instrument_id: number) => {
      if (!subscribedIds.has(instrument_id)) return;
      setSubscribedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(instrument_id);
        return newSet;
      });
      sendJSON({ action: "unsubscribe", instrument_id });
    },
    [subscribedIds, sendJSON]
  );

  const clearHistory = useCallback(() => {
    setServerData({});
  }, []);

  const clearInstrumentHistory = useCallback((instrument_id: number) => {
    setServerData((prev) => {
      const updated = { ...prev };
      delete updated[instrument_id];
      return updated;
    });
  }, []);

  useEffect(() => {
    instrumentIds.forEach((id) => {
      if (!subscribedIds.has(id)) {
        subscribe(id);
      }
    });

    subscribedIds.forEach((id) => {
      if (!instrumentIds.includes(id)) {
        unsubscribe(id);
      }
    });
  }, [instrumentIds, subscribe, subscribedIds, unsubscribe]);

  return {
    subscribe,
    unsubscribe,
    clearHistory,
    clearInstrumentHistory,
    isConnected: readyState === ReadyState.OPEN,
    readyState,
    currentSubscriptions: Array.from(subscribedIds),
    serverData,
  };
};
