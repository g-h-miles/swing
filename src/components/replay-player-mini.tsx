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

export interface ReplayPlayerMiniProps {
	replayId: string;
	autoPlay?: boolean;
}

export const ReplayPlayerMini = ({ replayId, autoPlay = false }: ReplayPlayerMiniProps) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const replay = useReplayStore((state) => state.replays.find((r) => r.id === replayId));

	const isPlaying = useReplayStore((state) => state.playingReplays.includes(replayId));
	const setPlayerState = useReplayStore(useCallback((state) => state.setPlayerState, []));



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



	if (!replay) {
		return (
			<div className="w-full h-full bg-gray-200 animate-pulse rounded-sm flex items-center justify-center">
				<span className="text-sm text-gray-500">Loading...</span>
			</div>
		);
	}

	return (
		<MediaPlayer className="w-full h-full rounded-sm border-0">
			<MediaPlayerVideo muted loop ref={videoRef} preload="metadata"
				onPlay={() => setPlayerState(replayId, "playing")}
				onPause={() => setPlayerState(replayId, "paused")}
				onEnded={() => setPlayerState(replayId, "ended")}
				onError={() => setPlayerState(replayId, "error")}
				onLoadStart={() => setPlayerState(replayId, "loading")}
			
			
			
			>
				<source src={`${replay.url}?x=${replayId}`} type="video/mp4" />
			</MediaPlayerVideo>
		</MediaPlayer>
	);
};
