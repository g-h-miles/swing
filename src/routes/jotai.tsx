import { MediaPlayer, MediaPlayerVideo } from "@/components/ui/media-player";
import {
	onLoadedMetadataReplayAtomFamily,
	onPauseReplayAtomFamily,
	onPlayReplayAtomFamily,
	readReplayStateAtomFamily,
	shouldPlayReplayAtomFamily,
	writeReplayStateAtomFamily,
} from "@/lib/stores/replay-atom";
import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useMemo, useRef } from "react";

export const Route = createFileRoute("/jotai")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col gap-4 w-4/5">
			<div>Hello "/jotai"!</div>
			<div className="text-red-500">I am a route component</div>
			<ReplayPlayerState />
			<ReplayPlayer />
		</div>
	);
}

const ReplayPlayer = () => {
	const onPlayAtom = useSetAtom(onPlayReplayAtomFamily("replay-1"));
	const onPauseAtom = useSetAtom(onPauseReplayAtomFamily("replay-1"));
	const onLoadedMetadataAtom = useSetAtom(
		onLoadedMetadataReplayAtomFamily("replay-1"),
	);
	const shouldPlayAtom = useAtomValue(shouldPlayReplayAtomFamily("replay-1"));
	const setReplayStateAtom = useSetAtom(writeReplayStateAtomFamily("replay-1"));
	const videoRef = useRef<HTMLVideoElement>(null);
	useEffect(() => {
		if (videoRef.current && shouldPlayAtom) {
			videoRef.current.play();
		}
		else if (videoRef.current) {
			videoRef.current.pause();
		}
	}, [shouldPlayAtom]);

	return (
		<div>
			<div>ReplayPlayer</div>
			<MediaPlayer className="w-full  rounded-sm border-0">
				<MediaPlayerVideo
					muted
					loop
					// autoPlay={true}
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
					<source
						src={"https://www.diceui.com/assets/cloud.mp4"}
						type="video/mp4"
					/>
				</MediaPlayerVideo>
			</MediaPlayer>
		</div>
	);
};

const ReplayPlayerState = () => {
	const replayState = useAtomValue(readReplayStateAtomFamily("replay-1"));
	return (
		<div>
			<div>ReplayPlayerState: {JSON.stringify(replayState)}</div>
		</div>
	);
};
