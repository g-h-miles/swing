import { useReplays } from "@/lib/hooks/use-replays";
import { useReplayStore } from "@/lib/stores/replay-store";
import { PlayIcon, StopIcon } from "@phosphor-icons/react";
import { useCallback } from "react";
import { GlassBtnBg } from "./glass-btn-bg";

export const PlayAllBtn = () => {
	const { data: replays } = useReplays();
	const playAll = useReplayStore(useCallback((state) => state.playAll, []));
	const pauseAll = useReplayStore(useCallback((state) => state.pauseAll, []));
	const playingReplays = useReplayStore((state) => state.playingReplays);
	const isPlayingAll = playingReplays.length > 0;

	const handlePlayPauseAll = useCallback(() => {
		if (!replays) return;
		if (isPlayingAll) {
			pauseAll();
		} else {
			playAll(replays.map((replay) => replay.id));
		}
	}, [isPlayingAll, playAll, pauseAll, replays]);

	return (
		<GlassBtnBg onClick={handlePlayPauseAll} className="scroll-anchor-target">
			{!isPlayingAll ? (
				<PlayIcon className="size-4" />
			) : (
				<StopIcon className="size-4" />
			)}
		</GlassBtnBg>
	);
};
