import { getBaseGlassStyles } from "@/glass";

import { replaysIdTitleAtom } from "@/lib/stores/replay-atom";
import { cn } from "@/lib/utils";
import { ArrowUpIcon } from "@phosphor-icons/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useAtomValue } from "jotai";
import { useCallback, useMemo, useRef } from "react";
import { Fragment } from "react/jsx-runtime";
import { FrostedGlassButton } from "./frosted-glass-button";
import { PlayAllBtn } from "./play-all-btn";
import { ReplayError } from "./replay-error";
import { ReplayLoader } from "./replay-loader";
import { ReplayPlayerMini } from "./replay-player-mini";
import { Separator } from "./ui/separator";

export function ReplayScroll({ className }: { className?: string }) {
  const { data: replays, isLoading, error } = useAtomValue(replaysIdTitleAtom);

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: replays?.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 136,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const showScrollToTop = useMemo(
    () =>
      virtualItems.length > 0 &&
      !rowVirtualizer.getVirtualIndexes().includes(0),
    [virtualItems, rowVirtualizer],
  );

  const handleScrollToTop = useCallback(() => {
    rowVirtualizer.scrollToIndex(0, { align: "start", behavior: "smooth" });
  }, [rowVirtualizer]);

  if (isLoading || !replays) return <ReplayLoader />;
  if (error) return <ReplayError />;

  return (
    <div className="h-full w-full py-1">
      <div
        className={cn(
          getBaseGlassStyles(),
          "border-border",
          "relative h-full rounded-sm border ",
          className,
        )}
      >
        <PlayAllBtn />
        <div
          ref={parentRef}
          className="h-full overflow-y-auto scrollbar "
          id="scroll-element"
        >
          <div
            className="relative w-full"
            style={{
              height: `${totalSize}px`,
            }}
          >
            <div
              className="absolute top-0 left-0 w-full p-1"
              style={{
                transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
              }}
            >
              {virtualItems.map((virtualItem) => {
                const replay = replays[virtualItem.index];
                if (!replay) return null;
                return (
                  <Fragment key={virtualItem.key}>
                    <div
                      data-index={virtualItem.index}
                      className="scroll-anchor text-sm min-h-16 rounded-sm hover:border hover:border-lime-400 relative cursor-pointer"
                    >
                      <ReplayPlayerMini replayId={replay.id} />
                      <span
                        className={cn(
                          "text-xs text-muted-foreground px-2 py-1 rounded-sm absolute top-1 left-1 z-10",
                          "fancy-fill",
                          "bg-white/5",
                          "bg-blend-overlay",
                        )}
                      >
                        {replay.title}
                      </span>
                    </div>
                    <Separator className="my-2" />
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {showScrollToTop && (
          <FrostedGlassButton
            onClick={handleScrollToTop}
            aria-label="Scroll to top"
            className="absolute top-2 left-2"
          >
            <ArrowUpIcon className="h-4 w-4" />
          </FrostedGlassButton>
        )}
      </div>
    </div>
  );
}
