import {
	MediaPlayer,
	MediaPlayerControls,
	MediaPlayerControlsOverlay,
	MediaPlayerFullscreen,
	MediaPlayerPiP,
	MediaPlayerPlay,
	MediaPlayerPlaybackSpeed,
	MediaPlayerSeek,
	MediaPlayerSeekBackward,
	MediaPlayerSeekForward,
	MediaPlayerTime,
	MediaPlayerVideo,
	MediaPlayerVolume,
	useMediaPlayer,
} from "@/components/ui/media-player";
import type { MediaController } from "media-chrome";
import { forwardRef, useImperativeHandle, useRef } from "react";
export interface ReplayPlayerHandles {
	play: () => void;
	pause: () => void;
	isPlaying: boolean;
}

export const ReplayPlayerMini = forwardRef<
	ReplayPlayerHandles,
	{ autoPlay: boolean }
>(({ autoPlay }, ref) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useImperativeHandle(ref, () => ({
		play: () => videoRef.current?.play(),
		pause: () => videoRef.current?.pause(),
		isPlaying: !videoRef.current?.paused,
	}));

	return (
		<MediaPlayer className="w-full h-full absolute top-0 left-0">
			<MediaPlayerVideo autoPlay={autoPlay} muted loop ref={videoRef}>
				<source
					src="https://www.diceui.com/assets/cloud.mp4"
					type="video/mp4"
				/>
			</MediaPlayerVideo>
			{/* <MediaPlayerControls className="flex-col items-start gap-2.5">
				<MediaPlayerControlsOverlay />
				<MediaPlayerSeek />
				<div className="flex w-full items-center gap-2">
					<div className="flex flex-1 items-center gap-2">
						<MediaPlayerPlay />
						<MediaPlayerSeekBackward />
						<MediaPlayerSeekForward />
						<MediaPlayerVolume expandable />
						<MediaPlayerTime />
					</div>
					<div className="flex items-center gap-2">
						<MediaPlayerPlaybackSpeed />
						<MediaPlayerPiP />
						<MediaPlayerFullscreen />
					</div>
				</div>
			</MediaPlayerControls> */}
		</MediaPlayer>
	);
});
