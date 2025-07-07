import { glassStyles } from "@/glass";
import { cn } from "@/lib/utils";
import { ArrowUpIcon } from "@phosphor-icons/react";
import { PlayIcon, StopIcon } from "@phosphor-icons/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { GlassBtnBg } from "./glass-btn-bg";
import {
	type ReplayPlayerHandles,
	ReplayPlayerMini,
} from "./replay-player-mini";

import { Separator } from "./ui/separator";

const tags = Array.from({ length: 50 }).map(
	(_, i, a) => `v1.2.0-beta.${a.length - i}`,
);

export function ReplayScroll({ className }: { className?: string }) {
	const parentRef = useRef<HTMLDivElement>(null);
	const playerRefs = useRef<Record<string, ReplayPlayerHandles | null>>({});
	const [isPlayingAll, setIsPlayingAll] = useState(true);

	const rowVirtualizer = useVirtualizer({
		count: tags.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 136, // 128px (h-32) + 8px (my-2)
	});

	const virtualItems = rowVirtualizer.getVirtualItems();
	const totalSize = rowVirtualizer.getTotalSize();

	// Determine if the button should be visible.
	// Show it only if the first virtual item is not the first actual item (index 0).
	const showScrollToTop =
		virtualItems.length > 0 && !rowVirtualizer.getVirtualIndexes().includes(0);
	// &&
	// !rowVirtualizer.isScrolling;

	const handleScrollToTop = () => {
		rowVirtualizer.scrollToIndex(0, { align: "start", behavior: "smooth" });
	};

	const handlePlayPauseAll = () => {
		setIsPlayingAll(!isPlayingAll);
	};

	useEffect(() => {
		for (const key in playerRefs.current) {
			const player = playerRefs.current[key];
			if (!player) continue;

			if (isPlayingAll) {
				player.play();
			}
			if (!isPlayingAll) {
				player.pause();
			}
		}
	}, [isPlayingAll]);

	return (
		// The parent container must be relative for absolute positioning of children.
		<div
			className={cn(
				"relative h-full rounded-sm border",
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
							const tag = tags[virtualItem.index];
							return (
								<Fragment key={virtualItem.key}>
									<div
										data-index={virtualItem.index}
										className="text-sm h-20 lg:h-32 rounded-sm hover:border hover:border-lime-400 relative cursor-pointer my-auto"
									>
										<ReplayPlayerMini
											autoPlay={true}
											ref={(el) => {
												playerRefs.current[virtualItem.key.toString()] = el;
											}}
										/>
										<span
											className={cn(
												"text-xs text-muted-foreground px-2 py-1 rounded-sm absolute top-1 left-1 z-10",
												"fancy-fill",
												"bg-white/5",
												"bg-blend-overlay",
											)}
										>
											{tag}
										</span>
										{/* <Button
											className="absolute bottom-1 right-1 z-10 bg-red-500"
											onClick={() => {
												playerRefs.current[virtualItem.key.toString()]?.pause();
											}}
										>
											Pause
										</Button> */}
									</div>
									<Separator className="my-2" />
								</Fragment>
							);
						})}
					</div>
				</div>
			</div>

			{/* The "Scroll to Top" button */}
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
	);
}
