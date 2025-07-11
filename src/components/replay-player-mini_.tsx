// components/replay-player-mini.tsx
import { MediaPlayer, MediaPlayerVideo } from "@/components/ui/media-player";
import {
	onLoadedMetadataReplayAtomFamily,
	onPauseReplayAtomFamily,
	onPlayReplayAtomFamily,
	readReplayPlayerURLAtomFamily,
	shouldPlayReplayAtomFamily,
	writeReplayStateAtomFamily,
} from "@/lib/stores/replay-atom";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { Skeleton } from "./ui/skeleton";

export const ReplayPlayerMini = ({
	replayId,
}: {
	replayId: string;
}) => {
	const onPlayAtom = useSetAtom(onPlayReplayAtomFamily(replayId));

	const onPauseAtom = useSetAtom(onPauseReplayAtomFamily(replayId));

	const onLoadedMetadataAtom = useSetAtom(
		onLoadedMetadataReplayAtomFamily(replayId),
	);

	const setReplayStateAtom = useSetAtom(writeReplayStateAtomFamily(replayId));

	const replayUrl = useAtomValue(readReplayPlayerURLAtomFamily(replayId));

	const shouldPlayAtom = useAtomValue(shouldPlayReplayAtomFamily(replayId));

	const videoRef = useRef<HTMLVideoElement>(null);
	useEffect(() => {
		if (videoRef.current && shouldPlayAtom) {
			videoRef.current.play();
		} else if (videoRef.current) {
			videoRef.current.pause();
		}
	}, [shouldPlayAtom]);

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
				onPlay={() => onPlayAtom()}
				onPause={() => onPauseAtom()}
				onEnded={() => setReplayStateAtom("ended")}
				onError={() => setReplayStateAtom("error")}
				onLoadStart={() => setReplayStateAtom("loading")}
				onCanPlay={() => setReplayStateAtom("paused")}
				onLoadedMetadata={() => onLoadedMetadataAtom()}
			>
				<source src={`${replayUrl}`} type="video/mp4" />
			</MediaPlayerVideo>
		</MediaPlayer>
	);
};
