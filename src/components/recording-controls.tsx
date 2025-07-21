import {
	readRecordingDurationMinutesAtom,
	readRecordingIsRecordingAtom,
	readRecordingStateAtom,
	startRecordingAtom,
	stopRecordingAtom,
} from "@/lib/stores/recording-atom";
import { readSelectedWebcamAtom } from "@/lib/stores/webcam-atom";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai";
import { api } from "../../convex/_generated/api";
import { atomStore } from "../lib/stores/atom-store";
import { RecordingButton } from "./recording-button";

interface RecordingControlsProps {
	panelId: string;
	className?: string;
}
const convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL;
export function RecordingControls({
	panelId,
	className,
}: RecordingControlsProps) {
	const generateUploadUrl = useMutation(api.replay.generateUploadUrl);
	const sendImage = useMutation(api.replay.sendVideo);
	const isRecording = useAtomValue(readRecordingIsRecordingAtom(panelId));
	const webcamSelection = useAtomValue(readSelectedWebcamAtom(panelId));
	const startRecording = useSetAtom(startRecordingAtom(panelId));
	const stopRecording = useSetAtom(stopRecordingAtom(panelId));

	const isWebcamActive = webcamSelection?.deviceId !== null;

	const handleToggleRecording = async () => {
		if (!isWebcamActive || !webcamSelection?.deviceId) return;

		if (isRecording) {
			stopRecording();
			const waitForBlob = () =>
				new Promise<Blob>((resolve) => {
					const checkBlob = () => {
						const state = atomStore.get(readRecordingStateAtom(panelId));
						if (state.recordedBlob) {
							resolve(state.recordedBlob);
						} else {
							setTimeout(checkBlob, 100);
						}
					};
					checkBlob();
				});

			const theBlob = await waitForBlob();
			// Step 1: Get a short-lived upload URL
			// const postUrl = await generateUploadUrl();
			// // Step 2: POST the file to the URL
			// const result = await fetch(postUrl, {
			// 	method: "POST",
			// 	headers: { "Content-Type": "video/webm" },
			// 	body: theBlob,
			// });
			// const { storageId } = await result.json();
			// // Step 3: Save the newly allocated storage id to the database
			// await sendImage({ storageId, author: "Graham Miles" });
			const sendImageUrl = new URL(`${convexSiteUrl}/sendReplay`);
			const now = new Date();
			const localDateTimeString = now.toLocaleString();
			sendImageUrl.searchParams.set("datetime", localDateTimeString);
			sendImageUrl.searchParams.set("deviceId", webcamSelection?.deviceId);
			sendImageUrl.searchParams.set("player", "Graham Miles");

			try {
				await fetch(sendImageUrl, {
					method: "POST",
					headers: { "Content-Type": "video/webm" },
					body: theBlob,
				});
			} catch (error) {
				console.error("Failed to send image:", error);
			}
		} else {
			startRecording(webcamSelection.deviceId);
		}
	};

	return (
		<div className={cn("flex items-center gap-2", className)}>
			{isRecording && <RecordingDuration panelId={panelId} />}
			<RecordingButton
				isRecording={isRecording}
				isDisabled={!isWebcamActive}
				onClick={handleToggleRecording}
			/>
		</div>
	);
}

const RecordingDuration = ({ panelId }: { panelId: string }) => {
	const duration = useAtomValue(readRecordingDurationMinutesAtom(panelId));
	return (
		<span className="text-xs text-muted-foreground font-mono">{duration}s</span>
	);
};
