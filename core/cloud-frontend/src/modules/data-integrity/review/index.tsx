/**
 * Data Integrity Review page (reference).
 *
 * Reached from the dashboard (Data Manager → Data Integrity Review) and the
 * daily email link (`/data-integrity/review`). Not run-scoped — shows all
 * currently-open flags as of the latest run. One tab per check; each renders
 * either its reviewable flags or a "no flags" state. Every flag is shown,
 * however many — a pathological run (a feed breaks → thousands) renders in full
 * because the table is the shared AG Grid `DataGrid` (row-virtualized, like the
 * rest of the dashboard).
 *
 * Reviewing model: each row has a Valid / Open segmented toggle (the Status
 * column). The decisions live in React state (`validIds`) — the single source
 * of truth — and reach the in-cell toggles through `ReviewDecisionsContext`, so
 * toggling a row (or "All Valid" / "Reset") updates the counts and repaints the
 * visible cells with no AG-Grid selection/imperative plumbing. Submit (behind a
 * confirm) acknowledges the Valid rows as VALID in one bulk update; Open means
 * "leave for follow-up". A single Submit covers every check.
 *
 * Renders inside the dashboard shell (MainLayout), filling the content area
 * (h-full) with a pinned submit footer. Theme tokens follow light/dark.
 */
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { ColDef, ICellRendererParams } from "@ag-grid-community/core";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@components/ui/alert-dialog";
import { Button } from "@components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { DataGrid } from "@components/Datagrid/Datagrid";
import { cn } from "@/utils/utils";

import type { CheckGroup, FlagDecision, FlagOut } from "./api";
import {
  type ReviewDecisionStatus,
  useAcknowledgeFlags,
  useRunFlags,
} from "./api";
import { colDefsFor } from "./columns";

const STATUSES: ReviewDecisionStatus[] = ["VALID", "OPEN"];

// Active-state tones for the segmented control.
const STATUS_ACTIVE: Record<ReviewDecisionStatus, string> = {
  VALID: "bg-green-500/15 text-green-500",
  OPEN: "bg-amber-500/15 text-amber-500",
};

const titleCase = (s: string) =>
  s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : s;

const reviewableFlags = (checks: CheckGroup[]) =>
  checks.flatMap((c) => c.flags);

const getRowId = (flag: FlagOut) => String(flag.id);

// Decisions are owned by the page and read by the in-cell Status toggles via
// context, so a toggle never needs the grid api and bulk changes repaint the
// visible cells automatically.
interface ReviewDecisionsApi {
  isValid: (flagId: number) => boolean;
  setStatus: (flagId: number, status: ReviewDecisionStatus) => void;
}
const ReviewDecisionsContext = createContext<ReviewDecisionsApi | null>(null);
const useReviewDecisions = (): ReviewDecisionsApi => {
  const ctx = useContext(ReviewDecisionsContext);
  if (!ctx) throw new Error("ReviewDecisionsContext missing");
  return ctx;
};

export const DataIntegrityReviewPage = () => {
  const { data, isLoading, isError, isFetching } = useRunFlags();
  const acknowledge = useAcknowledgeFlags();

  // Flag ids marked Valid (absent = Open). Single source of truth for the
  // toggles, the counts, and the submit payload.
  const [validIds, setValidIds] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<string>("");

  // Reset decisions when a new RUN loads — keyed on run_id, not the whole `data`
  // object, so a background refetch of the same run doesn't wipe in-progress
  // marks (acknowledged flags simply drop out of the next payload).
  useEffect(() => {
    if (!data) return;
    setValidIds(new Set());
    setActiveTab((prev) => prev || data.checks[0]?.check_type || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.run_id]);

  const setStatus = useCallback(
    (flagId: number, status: ReviewDecisionStatus) =>
      setValidIds((prev) => {
        const next = new Set(prev);
        if (status === "VALID") next.add(flagId);
        else next.delete(flagId);
        return next;
      }),
    []
  );

  const markAll = useCallback(
    (check: CheckGroup, status: ReviewDecisionStatus) =>
      setValidIds((prev) => {
        const next = new Set(prev);
        for (const flag of check.flags) {
          if (status === "VALID") next.add(flag.id);
          else next.delete(flag.id);
        }
        return next;
      }),
    []
  );

  // New object whenever validIds changes, so context consumers (the visible
  // Status toggles) repaint.
  const decisionsApi = useMemo<ReviewDecisionsApi>(
    () => ({ isValid: (id) => validIds.has(id), setStatus }),
    [validIds, setStatus]
  );

  // Scope counts to flags still in the run, so ids left over from an earlier
  // submit (acknowledged → dropped from `data`) don't inflate the totals and
  // Submit disables once nothing shown is marked.
  const counts = useMemo(() => {
    const flags = data ? reviewableFlags(data.checks) : [];
    let valid = 0;
    for (const flag of flags) if (validIds.has(flag.id)) valid += 1;
    return { valid, open: flags.length - valid };
  }, [validIds, data]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-background text-sm text-muted-foreground antialiased">
        Loading review…
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div className="flex h-full items-center justify-center bg-background p-8 text-center text-sm text-destructive antialiased">
        Could not load the review right now — please refresh. If it persists,
        check the latest daily email.
      </div>
    );
  }

  const submit = () => {
    // Only submit flags still in the run — never re-send ones a prior submit
    // already acknowledged (they've dropped out of `data`).
    const present = new Set(reviewableFlags(data.checks).map((f) => f.id));
    const payload: FlagDecision[] = [...validIds]
      .filter((id) => present.has(id))
      .map((id): FlagDecision => ({ flag_id: id, status: "VALID" }));
    if (payload.length === 0) return;
    acknowledge.mutate(payload);
  };

  return (
    <ReviewDecisionsContext.Provider value={decisionsApi}>
      <div className="flex h-full flex-col bg-background text-base text-foreground antialiased">
        <header className="shrink-0 px-6 pb-5 pt-8 lg:px-10 2xl:px-14">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="mb-2 text-xs uppercase tracking-[0.08em] text-muted-foreground">
                Demo Data QC · Daily Review
              </div>
              <h1 className="text-[28px] font-semibold leading-tight">
                Data Integrity Review
              </h1>
              <p className="mt-2.5 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
                One tab per check. Mark a flag <b>Valid</b> to acknowledge it —
                that records your decision and clears it from this review. Flags
                left <b>Open</b> reappear in the next run. Submit once when
                done.
              </p>
            </div>
            <div className="flex gap-3">
              <Stat label="Valid" value={counts.valid} tone="text-green-500" />
              <Stat label="Open" value={counts.open} tone="text-amber-500" />
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col px-6 pb-4 lg:px-10 2xl:px-14">
          {data.checks.length === 0 ? (
            <State
              icon="✓"
              tone="text-green-500"
              title="All checks passed"
              detail="No open anomalies for the latest run — nothing to review."
            />
          ) : (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex min-h-0 flex-1 flex-col"
            >
              <TabsList className="h-auto shrink-0 flex-wrap items-end justify-start gap-1.5 border-0 bg-background p-0">
                {data.checks.map((check) => {
                  const badge = tabBadge(check, validIds);
                  return (
                    <TabsTrigger
                      key={check.check_type}
                      value={check.check_type}
                      className="rounded-lg border border-border px-5 py-3 text-[15px] text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-none"
                    >
                      {check.title}
                      <span
                        className={cn(
                          "ml-2 inline-flex min-w-[24px] items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium",
                          badge.tone
                        )}
                        aria-label={badge.ariaLabel}
                      >
                        <span aria-hidden="true">{badge.text}</span>
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {data.checks.map((check) => (
                <TabsContent
                  key={check.check_type}
                  value={check.check_type}
                  className="mt-3 min-h-0 flex-1 data-[state=inactive]:hidden"
                >
                  {check.open_count === 0 ? (
                    <State
                      icon="✓"
                      tone="text-green-500"
                      title="No flags for this check"
                      detail={`${check.title} produced no open anomalies. Nothing to review here.`}
                    />
                  ) : (
                    <CheckGrid check={check} onMarkAll={markAll} />
                  )}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>

        <footer className="flex shrink-0 items-center gap-4 border-t border-border bg-muted px-6 py-4 lg:px-10 2xl:px-14">
          <div className="text-[15px] text-muted-foreground">
            <b className="text-green-500">{counts.valid}</b> valid ·{" "}
            <b className="text-amber-500">{counts.open}</b> open
            <span className="ml-2 text-muted-foreground">
              · Re-open this link before the next run to finish any flags you
              left Open.
            </span>
            {acknowledge.isSuccess && (
              <span className="ml-3 text-green-500">
                Saved {acknowledge.data?.updated} decision(s).
              </span>
            )}
            {acknowledge.isError && (
              <span className="ml-3 text-destructive">
                Submit failed — please retry.
              </span>
            )}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="ml-auto"
                disabled={
                  acknowledge.isPending || isFetching || counts.valid === 0
                }
              >
                {acknowledge.isPending ? "Submitting…" : "Submit review →"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Submit {counts.valid} Valid decision
                  {counts.valid === 1 ? "" : "s"}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This acknowledges the {counts.valid} flag
                  {counts.valid === 1 ? "" : "s"} you marked <b>Valid</b> and
                  clears {counts.valid === 1 ? "it" : "them"} from this review.
                  The {counts.open} flag{counts.open === 1 ? "" : "s"} left{" "}
                  <b>Open</b> stay untouched and reappear in the next run.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={submit}>
                  Submit {counts.valid} Valid
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </footer>
      </div>
    </ReviewDecisionsContext.Provider>
  );
};

const Stat = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: string;
}) => (
  <div className="min-w-[116px] rounded-xl border border-border bg-card px-5 py-3.5">
    <div className={cn("text-[28px] font-semibold leading-none", tone)}>
      {value}
    </div>
    <div className="mt-2 text-xs uppercase tracking-[0.04em] text-muted-foreground">
      {label}
    </div>
  </div>
);

const tabBadge = (
  check: CheckGroup,
  validIds: Set<number>
): { text: string; tone: string; ariaLabel: string } => {
  if (check.open_count === 0) {
    return {
      text: "✓",
      tone: "bg-green-500/15 text-green-500",
      ariaLabel: "no flags",
    };
  }
  const reviewed =
    check.flags.length > 0 && check.flags.every((f) => validIds.has(f.id));
  return reviewed
    ? {
        text: `✓ ${check.open_count}`,
        tone: "bg-green-500/15 text-green-500",
        ariaLabel: `${check.open_count} flags, all marked valid`,
      }
    : {
        text: String(check.open_count),
        tone: "border border-border text-foreground",
        ariaLabel: `${check.open_count} flags to review`,
      };
};

/** Segmented Valid / Open control. */
const StatusToggle = ({
  value,
  onChange,
}: {
  value: ReviewDecisionStatus;
  onChange: (status: ReviewDecisionStatus) => void;
}) => (
  <div className="inline-flex overflow-hidden rounded-lg border border-border text-[13px]">
    {STATUSES.map((status, i) => {
      const active = value === status;
      return (
        <button
          key={status}
          type="button"
          aria-pressed={active}
          onClick={() => onChange(status)}
          className={cn(
            "px-4 py-1.5 transition-colors",
            i > 0 && "border-l border-border",
            active
              ? cn("font-semibold", STATUS_ACTIVE[status])
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {titleCase(status)}
        </button>
      );
    })}
  </div>
);

/** Status column cell renderer — reads/writes the decision via context. */
const StatusCell = (params: ICellRendererParams<FlagOut>) => {
  const { isValid, setStatus } = useReviewDecisions();
  const id = params.data?.id;
  if (id == null) return null;
  return (
    <StatusToggle
      value={isValid(id) ? "VALID" : "OPEN"}
      onChange={(status) => setStatus(id, status)}
    />
  );
};

const STATUS_COL: ColDef<FlagOut> = {
  colId: "__status",
  headerName: "Status",
  pinned: "right",
  width: 172,
  minWidth: 172,
  maxWidth: 172,
  flex: 0,
  sortable: false,
  resizable: false,
  suppressMovable: true,
  suppressHeaderMenuButton: true,
  cellStyle: { display: "flex", alignItems: "center" },
  cellRenderer: StatusCell,
};

/**
 * Per-check grid. Columns are the check's display columns plus the interactive
 * Status toggle; selection state lives in the page (via context), so the grid
 * itself is presentational and stays virtualized regardless of flag count.
 */
const CheckGrid = ({
  check,
  onMarkAll,
}: {
  check: CheckGroup;
  onMarkAll: (check: CheckGroup, status: ReviewDecisionStatus) => void;
}) => {
  const colDefs = useMemo<ColDef<FlagOut>[]>(
    () => [...colDefsFor(check.check_type), STATUS_COL],
    [check.check_type]
  );

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-lg font-semibold">{check.title}</span>
        <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted-foreground">
          {check.open_count} flags
        </span>
        <div className="ml-auto flex gap-2">
          <GhostButton onClick={() => onMarkAll(check, "VALID")}>
            ✓ All Valid
          </GhostButton>
          <GhostButton onClick={() => onMarkAll(check, "OPEN")}>
            ↺ Reset
          </GhostButton>
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <DataGrid<FlagOut>
          rowData={check.flags}
          columnDefs={colDefs}
          getRowId={getRowId}
          defaultColDef={{
            sortable: false,
            suppressHeaderMenuButton: true,
            flex: 0,
          }}
          autoSizeStrategy={{ type: "fitCellContents" }}
          rowHeight={48}
          reactiveCustomComponents
        />
      </div>
    </div>
  );
};

const GhostButton = ({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <Button variant="outline" size="sm" onClick={onClick} disabled={disabled}>
    {children}
  </Button>
);

const State = ({
  icon,
  tone,
  title,
  detail,
}: {
  icon: string;
  tone: string;
  title: string;
  detail: string;
}) => (
  <div className="flex h-full flex-col items-center justify-center gap-2.5 px-6 py-16 text-center">
    <div className={cn("text-3xl", tone)}>{icon}</div>
    <div className="text-base font-semibold">{title}</div>
    <div className="max-w-md text-sm leading-relaxed text-muted-foreground">
      {detail}
    </div>
  </div>
);
