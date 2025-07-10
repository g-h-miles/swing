// components/replay-player-mini.tsx
import { MediaPlayer, MediaPlayerVideo } from "@/components/ui/media-player";
import {
	getReplayStateAtomFamily,
	getReplayUrlAtomFamily,
	isReplayPlayingAtomFamily,
	playingReplayIdsAtom,
	replayAtomFamily,
	replaysQueryAtom,
	setPlayerStateAtomFamily,
} from "@/lib/stores/replay-atom";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { Skeleton } from "./ui/skeleton";

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

export const ReplayPlayerMini = ({
	replayId,
	autoPlay = false,
}: ReplayPlayerMiniProps) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	const replayUrl = useAtomValue(getReplayUrlAtomFamily(replayId));
	// const replayState = useAtomValue(getReplayStateAtomFamily(replayId));

	const isPlaying = useAtomValue(isReplayPlayingAtomFamily(replayId));
	const setPlayerState = useSetAtom(setPlayerStateAtomFamily(replayId));

	// Sync store state with video element - store is the single source of truth
	useEffect(() => {
		if (!videoRef.current || !replayUrl) return;

		if (isPlaying && videoRef.current.paused) {
			videoRef.current.play().catch(() => {
				// Ignore play errors (e.g., when component unmounts)
			});
		} else if (!isPlaying && !videoRef.current.paused) {
			videoRef.current.pause();
		}
	}, [isPlaying, replayUrl]);

	if (!replayUrl) {
		return (
			<div className="w-full">
				<Skeleton
					key={`skeleton-${Math.random()}`}
					className="bg-gray-400 h-24 w-full rounded-md"
				/>
			</div>
		);
	}

	return (
		<MediaPlayer className="w-full  rounded-sm border-0">
			<MediaPlayerVideo
				muted
				loop
				ref={videoRef}
				preload="metadata"
				onPlay={() => setPlayerState("playing")}
				// onPause={() => setPlayerState("paused")}
				onEnded={() => setPlayerState("ended")}
				onError={() => setPlayerState("error")}
				onLoadStart={() => setPlayerState("loading")}
			>
				<source src={`${replayUrl}`} type="video/mp4" />
			</MediaPlayerVideo>
		</MediaPlayer>
	);
};
