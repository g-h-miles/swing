// components/replay-player-mini.tsx
import { MediaPlayer, MediaPlayerVideo } from "@/components/ui/media-player";
import { useReplayStore } from "@/lib/stores/replay-store";
import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
} from "react";
import { useShallow } from "zustand/react/shallow";

export interface ReplayPlayerHandles {
	play: () => void;
	pause: () => void;
	state: string;
	rate: number;
	volume: number;
}

export const ReplayPlayerMini = forwardRef<
	ReplayPlayerHandles,
	{ replayId: string; autoPlay?: boolean }
>(({ replayId, autoPlay = false }, ref) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	const { replay, playerState, isPlaying } = useReplayStore(
		useShallow((state) => ({
			replay: state.replays.find((r) => r.id === replayId),
			playerState: state.playerStates[replayId],
			isPlaying: state.playingReplays.includes(replayId),
		})),
	);

	const playReplay = useReplayStore((state) => state.playReplay);
	const pauseReplay = useReplayStore((state) => state.pauseReplay);

	const play = useCallback(() => {
		playReplay(replayId);
	}, [playReplay, replayId]);

	const pause = useCallback(() => {
		pauseReplay(replayId);
	}, [pauseReplay, replayId]);

	// Sync store state with video element - store is the single source of truth
	useEffect(() => {
		if (!videoRef.current) return;

		if (isPlaying && videoRef.current.paused) {
			videoRef.current.play().catch(() => {
				// Ignore play errors (e.g., when component unmounts)
			});
		} else if (!isPlaying && !videoRef.current.paused) {
			videoRef.current.pause();
		}
	}, [isPlaying]);

	useImperativeHandle(
		ref,
		() => ({
			play,
			pause,
			state: playerState?.state || "mounting",
			rate: playerState?.playbackRate || 1,
			volume: playerState?.volume || 1,
		}),
		[
			play,
			pause,
			playerState?.state,
			playerState?.playbackRate,
			playerState?.volume,
		],
	);

	if (!replay) {
		return (
			<div className="w-full h-full bg-gray-200 animate-pulse rounded-sm flex items-center justify-center">
				<span className="text-sm text-gray-500">Loading...</span>
			</div>
		);
	}

	return (
		<MediaPlayer className="w-full h-full rounded-sm border-0">
			<MediaPlayerVideo muted loop ref={videoRef} preload="metadata">
				<source src={replay.url} type="video/mp4" />
			</MediaPlayerVideo>
		</MediaPlayer>
	);
});
