import { useEffect, useState, useRef, useCallback } from "react";

interface ClipPathCoordinates {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

const calculateClipPathCoordinates = (
  element: HTMLElement,
  padding: number = 5
): ClipPathCoordinates => {
  const rect = element.getBoundingClientRect();

  const viewportWidth =
    window.innerWidth || document.documentElement.clientWidth;
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;

  return {
    top: Math.max(0, Math.min(viewportHeight, rect.top - padding)),
    left: Math.max(0, Math.min(viewportWidth, rect.left - padding)),
    right: Math.min(viewportWidth, rect.right + padding),
    bottom: Math.min(viewportHeight, rect.bottom + padding),
  };
};

const createClipPathPolygon = (coords: ClipPathCoordinates): string => {
  return `
    polygon(
      0% 0%,
      100% 0%,
      100% 100%,
      0% 100%,
      0% ${coords.top}px,
      ${coords.left}px ${coords.top}px,
      ${coords.left}px ${coords.bottom}px,
      ${coords.right}px ${coords.bottom}px,
      ${coords.right}px ${coords.top}px,
      0% ${coords.top}px
    )
  `;
};

interface UseElementHighlightProps {
  isActive: boolean;
  targetSelector?: string;
  onClose?: () => void;
}

export const useElementHighlight = (props: UseElementHighlightProps) => {
  const { isActive, targetSelector = ".interactive", onClose } = props;

  const [activeElement, setActiveElement] = useState<HTMLElement | null>(null);
  const elementsFoundRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const attemptsRef = useRef(0);
  const maxAttempts = 10;
  const unifiedIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleOverlayClick = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const cleanup = useCallback(
    (fullCleanup = false) => {
      if (unifiedIntervalRef.current) {
        clearInterval(unifiedIntervalRef.current);
        unifiedIntervalRef.current = null;
      }

      if (activeElement) {
        activeElement.classList.remove("feature-highlighted-trigger");
      }

      if (overlayRef.current) {
        overlayRef.current.removeEventListener("click", handleOverlayClick);
        document.body.removeChild(overlayRef.current);
        overlayRef.current = null;
      }

      if (fullCleanup) {
        setActiveElement(null);
        elementsFoundRef.current = false;
        attemptsRef.current = 0;
      }
    },
    [activeElement, handleOverlayClick]
  );

  const manageOverlay = useCallback(
    (shouldShow: boolean) => {
      if (shouldShow && !overlayRef.current) {
        const overlay = document.createElement("div");
        overlay.className = "feature-dialog-overlay";
        overlay.id = "tour-overlay";
        overlay.style.clipPath = "none";
        overlay.addEventListener("click", handleOverlayClick);
        document.body.appendChild(overlay);
        overlayRef.current = overlay;
      } else if (!shouldShow && overlayRef.current) {
        overlayRef.current.removeEventListener("click", handleOverlayClick);
        document.body.removeChild(overlayRef.current);
        overlayRef.current = null;
      }
    },
    [handleOverlayClick]
  );

  const updateClipPath = useCallback((element: HTMLElement | null) => {
    if (!element || !overlayRef.current) return;

    try {
      const coordinates = calculateClipPathCoordinates(element);
      overlayRef.current.style.clipPath = createClipPathPolygon(coordinates);
    } catch (error) {
      console.error("Error updating clip path: ", error);
    }
  }, []);

  const findAndHighlightElement = useCallback(() => {
    try {
      const elements = Array.from(
        document.querySelectorAll<HTMLElement>(targetSelector)
      );

      if (elements.length === 0) {
        return false;
      }

      if (!elementsFoundRef.current) {
        const element = elements[0];
        setActiveElement(element);
        elementsFoundRef.current = true;

        element.classList.add("feature-highlighted-trigger");

        element.onclick = () => {
          onClose?.();
        };

        manageOverlay(true);
        updateClipPath(element);
      }

      return true;
    } catch (error) {
      console.error("Error finding and highlighting element: ", error);
      return false;
    }
  }, [targetSelector, manageOverlay, updateClipPath, onClose]);

  useEffect(() => {
    if (!isActive) {
      cleanup(true);
      return;
    }

    const foundInitially = findAndHighlightElement();

    if (foundInitially && elementsFoundRef.current && activeElement) {
      updateClipPath(activeElement);
    }

    unifiedIntervalRef.current = setInterval(() => {
      if (!elementsFoundRef.current) {
        attemptsRef.current++;

        const found = findAndHighlightElement();

        if (found) {
          return;
        } else if (attemptsRef.current >= maxAttempts) {
          cleanup();
        }
      } else if (activeElement) {
        updateClipPath(activeElement);
      }
    }, 200);

    return () => {
      cleanup(true);
    };
  }, [
    isActive,
    targetSelector,
    manageOverlay,
    findAndHighlightElement,
    cleanup,
    activeElement,
    updateClipPath,
  ]);

  return { activeElement };
};
