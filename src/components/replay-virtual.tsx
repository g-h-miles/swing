import { glassStyles } from "@/glass";
import { initializeDummyData, useReplayStore } from "@/lib/stores/replay-store";
import { cn } from "@/lib/utils";
import { ArrowUpIcon } from "@phosphor-icons/react";
import { PlayIcon, StopIcon } from "@phosphor-icons/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Fragment } from "react/jsx-runtime";
import { useShallow } from "zustand/react/shallow";
import { GlassBtnBg } from "./glass-btn-bg";
import { ReplayPlayerMini } from "./replay-player-mini";
import { Separator } from "./ui/separator";

export function ReplayScroll({ className }: { className?: string }) {
	const { replays, playAll, pauseAll, playingReplays } = useReplayStore(
		useShallow((state) => ({
			replays: state.replays,
			playAll: state.playAll,
			pauseAll: state.pauseAll,
			playingReplays: state.playingReplays,
		})),
	);
	const isPlayingAll = playingReplays.length > 0;
	const parentRef = useRef<HTMLDivElement>(null);

	// Initialize dummy data only once when component mounts
	useEffect(() => {
		if (replays.length === 0) {
			initializeDummyData();
		}
	}, [replays.length]);

	const handlePlayPauseAll = useCallback(() => {
		if (isPlayingAll) {
			pauseAll();
		} else {
			playAll();
		}
	}, [isPlayingAll, playAll, pauseAll]);

	const rowVirtualizer = useVirtualizer({
		count: replays.length,
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

	if (replays.length === 0) {
		return (
			<div
				className={cn(
					"relative h-full rounded-sm border flex items-center justify-center",
					glassStyles.shadow,
					glassStyles.blur,
					className,
				)}
			>
				<span className="text-sm text-muted-foreground">
					Loading replays...
				</span>
			</div>
		);
	}

	return (
		<div className="h-full w-full py-1">
			<div
				className={cn(
					"relative h-full rounded-sm border ",
					glassStyles.shadow,
					glassStyles.blur,
					className,
				)}
			>
				<GlassBtnBg
					onClick={handlePlayPauseAll}
					className="absolute top-2 right-2"
				>
					{!isPlayingAll ? (
						<PlayIcon className="size-4" />
					) : (
						<StopIcon className="size-4" />
					)}
				</GlassBtnBg>
				<div ref={parentRef} className="h-full overflow-y-auto">
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
											className="text-sm h-12 md:h-16 lg:h-24 xl:h-36  2xl:h-46 3xl:h-40 rounded-sm hover:border hover:border-lime-400 relative cursor-pointer"
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
					<GlassBtnBg
						onClick={handleScrollToTop}
						aria-label="Scroll to top"
						className="absolute top-2 left-2"
					>
						<ArrowUpIcon className="h-4 w-4" />
					</GlassBtnBg>
				)}
			</div>
		</div>
	);
}
