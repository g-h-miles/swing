import { glassStyles } from "@/glass";
import { cn } from "@/lib/utils";
import { ArrowUpIcon } from "@phosphor-icons/react";
import { PlayIcon, StopIcon } from "@phosphor-icons/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import {
	type ReplayPlayerHandles,
	ReplayPlayerMini,
} from "./replay-player-mini";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const tags = Array.from({ length: 50 }).map(
	(_, i, a) => `v1.2.0-beta.${a.length - i}`,
);

export function ReplayScroll({ className }: { className?: string }) {
	const parentRef = useRef<HTMLDivElement>(null);
	const playerRefs = useRef<Record<string, ReplayPlayerHandles | null>>({});
	const [isPlaying, setIsPlaying] = useState(true);

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

	const handlePlayPause = () => {
		setIsPlaying(!isPlaying);
	};

	return (
		// The parent container must be relative for absolute positioning of children.
		<div
			className={cn(
				"relative h-full rounded-xs border",
				glassStyles.shadow,
				glassStyles.blur,
				className,
			)}
		>
			<Button
				className={cn(
					"absolute top-2 right-2 z-10 h-10 w-10 transition-opacity duration-600",
					"fancy-fill",
					"bg-white/5",
					"bg-blend-overlay",
					glassStyles.border,
					glassStyles.buttonHover,
				)}
				onClick={handlePlayPause}
			>
				{!isPlaying ? (
					<PlayIcon className="size-4" />
				) : (
					<StopIcon className="size-4" />
				)}
			</Button>
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
							if (
								playerRefs.current[virtualItem.key.toString()]?.isPlaying &&
								!isPlaying
							) {
								playerRefs.current[virtualItem.key.toString()]?.pause();
							}
							if (
								!playerRefs.current[virtualItem.key.toString()]?.isPlaying &&
								isPlaying
							) {
								playerRefs.current[virtualItem.key.toString()]?.play();
							}
							const tag = tags[virtualItem.index];
							return (
								<Fragment key={virtualItem.key}>
									<div
										data-index={virtualItem.index}
										className="text-sm h-32 rounded-md border border-lime-400 relative"
									>
										<ReplayPlayerMini
											autoPlay={isPlaying}
											ref={(el) => {
												playerRefs.current[virtualItem.key.toString()] = el;
											}}
										/>
										<span
											className={cn(
												"text-xs text-muted-foreground px-2 py-1 rounded-md absolute top-1 left-1 z-10",
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
				<Button
					variant="ghost"
					size="icon"
					onClick={handleScrollToTop}
					className={cn(
						"absolute top-2 left-2 z-10 h-10 w-10 transition-opacity duration-600",
						"fancy-fill",
						"bg-white/5",
						"bg-blend-overlay",
						glassStyles.border,
						glassStyles.buttonHover,
					)}
					aria-label="Scroll to top"
				>
					<ArrowUpIcon className="h-4 w-4" />
				</Button>
			)}
		</div>
	);
}
