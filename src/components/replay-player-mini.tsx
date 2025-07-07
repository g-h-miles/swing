import {
	MediaPlayer,
	// MediaPlayerControls,
	// MediaPlayerControlsOverlay,
	// MediaPlayerFullscreen,
	// MediaPlayerPiP,
	// MediaPlayerPlay,
	// MediaPlayerPlaybackSpeed,
	// MediaPlayerSeek,
	// MediaPlayerSeekBackward,
	// MediaPlayerSeekForward,
	// MediaPlayerTime,
	MediaPlayerVideo,
	// MediaPlayerVolume,
	// useMediaPlayer,
} from "@/components/ui/media-player";
// import type { MediaController } from "media-chrome";
import {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
export interface ReplayPlayerHandles {
	play: () => void;
	pause: () => void;
	state: replayState;
	rate: number;
	volume: number;
}

type replayState =
	| "playing"
	| "paused"
	| "ended"
	| "loading"
	| "error"
	| "mounting";

export const ReplayPlayerMini = forwardRef<
	ReplayPlayerHandles,
	{ autoPlay: boolean }
>(({ autoPlay }, ref) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [videoState, setVideoState] = useState<replayState>("mounting");
	const [playbackRate, setPlaybackRate] = useState(1);
	const [volume, setVolume] = useState(1);

	const play = useCallback(() => {
		videoRef.current?.play();
	}, []);

	const pause = useCallback(() => {
		videoRef.current?.pause();
	}, []);

	useImperativeHandle(
		ref,
		() => ({
			play,
			pause,
			state: videoState,
			rate: playbackRate,
			volume: volume,
		}),
		[videoState, playbackRate, volume, play, pause],
	);

	const isPlaying = videoState === "playing";
	const handlePlay = useCallback(() => {
		if (!isPlaying) setVideoState("playing");
	}, [isPlaying]);

	const isPaused = videoState === "paused";
	const handlePause = useCallback(() => {
		if (!isPaused) setVideoState("paused");
	}, [isPaused]);

	const isEnded = videoState === "ended";
	const handleEnded = useCallback(() => {
		if (!isEnded) setVideoState("ended");
	}, [isEnded]);

	const isError = videoState === "error";
	const handleError = useCallback(() => {
		if (!isError) setVideoState("error");
	}, [isError]);

	const isLoading = videoState === "loading";
	const handleLoadStart = useCallback(() => {
		if (!isLoading) setVideoState("loading");
	}, [isLoading]);

	const handleRateChange = useCallback(
		(e: React.SyntheticEvent<HTMLVideoElement>) => {
			const newRate = e.currentTarget.playbackRate;
			if (newRate !== playbackRate) setPlaybackRate(newRate);
		},
		[playbackRate],
	);

	const handleVolumeChange = useCallback(
		(e: React.SyntheticEvent<HTMLVideoElement>) => {
			const newVolume = e.currentTarget.volume;
			if (newVolume !== volume) setVolume(newVolume);
		},
		[volume],
	);

	return (
		<MediaPlayer className="w-full h-full rounded-sm border-0">
			<MediaPlayerVideo
				autoPlay={autoPlay}
				muted
				loop
				ref={videoRef}
				onPlay={handlePlay}
				onPause={handlePause}
				onEnded={handleEnded}
				onError={handleError}
				onLoadStart={handleLoadStart}
				onRateChange={handleRateChange}
				onVolumeChange={handleVolumeChange}
			>
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
