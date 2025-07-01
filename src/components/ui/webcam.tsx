import { cn } from "@/lib/utils";
import type * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ScreenshotDimensions {
	width: number;
	height: number;
}

interface ChildrenProps {
	getScreenshot: (screenshotDimensions?: ScreenshotDimensions) => string | null;
}

export interface WebcamProps
	extends Omit<React.HTMLProps<HTMLVideoElement>, "ref" | "children"> {
	audio?: boolean;
	audioConstraints?: MediaStreamConstraints["audio"];
	disablePictureInPicture?: boolean;
	forceScreenshotSourceSize?: boolean;
	imageSmoothing?: boolean;
	mirrored?: boolean;
	minScreenshotHeight?: number;
	minScreenshotWidth?: number;
	onUserMedia?: (stream: MediaStream) => void;
	onUserMediaError?: (error: string | DOMException) => void;
	screenshotFormat?: "image/webp" | "image/png" | "image/jpeg";
	screenshotQuality?: number;
	videoConstraints?: MediaStreamConstraints["video"];
	children?: (childrenProps: ChildrenProps) => React.JSX.Element;
}

export function Webcam({
	audio = false,
	audioConstraints,
	disablePictureInPicture = false,
	forceScreenshotSourceSize = false,
	imageSmoothing = true,
	mirrored = false,
	minScreenshotHeight,
	minScreenshotWidth,
	onUserMedia = () => {},
	onUserMediaError = () => {},
	screenshotFormat = "image/webp",
	screenshotQuality = 0.92,
	videoConstraints,
	children,
	style = {},
	...rest
}: WebcamProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

	const [hasUserMedia, setHasUserMedia] = useState(false);

	const stopMediaStream = useCallback((stream: MediaStream | null) => {
		if (stream) {
			for (const track of stream.getTracks()) {
				track.stop();
				stream.removeTrack(track);
			}
		}
	}, []);

	const requestUserMedia = useCallback(async () => {
		if (!navigator.mediaDevices?.getUserMedia) {
			onUserMediaError("getUserMedia not supported");
			return;
		}

		const constraints: MediaStreamConstraints = {
			video: videoConstraints ?? true,
			...(audio && { audio: audioConstraints ?? true }),
		};

		try {
			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			streamRef.current = stream;

			if (videoRef.current) {
				videoRef.current.srcObject = stream;
			}

			setHasUserMedia(true);
			onUserMedia(stream);
		} catch (error) {
			setHasUserMedia(false);
			onUserMediaError(error as DOMException);
		}
	}, [
		audio,
		audioConstraints,
		videoConstraints,
		onUserMedia,
		onUserMediaError,
	]);

	const getCanvas = useCallback(
		(screenshotDimensions?: ScreenshotDimensions) => {
			const video = videoRef.current;
			if (!video || !hasUserMedia || !video.videoHeight) return null;

			if (!ctxRef.current) {
				let canvasWidth = video.videoWidth;
				let canvasHeight = video.videoHeight;

				if (!forceScreenshotSourceSize) {
					const aspectRatio = canvasWidth / canvasHeight;
					canvasWidth = minScreenshotWidth || video.clientWidth;
					canvasHeight = canvasWidth / aspectRatio;

					if (minScreenshotHeight && canvasHeight < minScreenshotHeight) {
						canvasHeight = minScreenshotHeight;
						canvasWidth = canvasHeight * aspectRatio;
					}
				}

				canvasRef.current = document.createElement("canvas");
				canvasRef.current.width = canvasWidth;
				canvasRef.current.height = canvasHeight;
				ctxRef.current = canvasRef.current.getContext("2d");
			}

			const canvas = canvasRef.current;
			const ctx = ctxRef.current;

			if (!canvas || !ctx) return null;

			canvas.width = screenshotDimensions?.width || canvas.width;
			canvas.height = screenshotDimensions?.height || canvas.height;

			if (mirrored) {
				ctx.translate(canvas.width, 0);
				ctx.scale(-1, 1);
			}

			ctx.imageSmoothingEnabled = imageSmoothing;
			ctx.drawImage(
				video,
				0,
				0,
				screenshotDimensions?.width || canvas.width,
				screenshotDimensions?.height || canvas.height,
			);

			if (mirrored) {
				ctx.scale(-1, 1);
				ctx.translate(-canvas.width, 0);
			}

			return canvas;
		},
		[
			hasUserMedia,
			forceScreenshotSourceSize,
			minScreenshotWidth,
			minScreenshotHeight,
			mirrored,
			imageSmoothing,
		],
	);

	const getScreenshot = useCallback(
		(screenshotDimensions?: ScreenshotDimensions) => {
			if (!hasUserMedia) return null;
			const canvas = getCanvas(screenshotDimensions);
			return canvas?.toDataURL(screenshotFormat, screenshotQuality) || null;
		},
		[hasUserMedia, getCanvas, screenshotFormat, screenshotQuality],
	);

	useEffect(() => {
		requestUserMedia();

		return () => {
			stopMediaStream(streamRef.current);
		};
	}, [requestUserMedia, stopMediaStream]);

	useEffect(() => {
		if (hasUserMedia) {
			stopMediaStream(streamRef.current);
			requestUserMedia();
		}
	}, [hasUserMedia, requestUserMedia, stopMediaStream]);

	const videoStyle = mirrored
		? { ...style, transform: `${style.transform || ""} scaleX(-1)` }
		: style;

	const { className, ...restLessClassname } = rest;

	return (
		<>
			<video
				className={cn("bg-black", className)}
				ref={videoRef}
				autoPlay
				disablePictureInPicture={disablePictureInPicture}
				muted={!audio}
				playsInline
				style={videoStyle}
				{...restLessClassname}
			/>
			{children?.({ getScreenshot })}
		</>
	);
}
