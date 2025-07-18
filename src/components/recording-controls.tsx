import {
	readRecordingStateAtom,
	startRecordingAtom,
	stopRecordingAtom,
} from "@/lib/stores/recording-atom";
import { readSelectedWebcamAtom } from "@/lib/stores/webcam-atom";
import { cn } from "@/lib/utils";
import { useAtomValue, useSetAtom } from "jotai";
import { RecordingButton } from "./recording-button";

interface RecordingControlsProps {
	panelId: string;
	className?: string;
}

export function RecordingControls({
	panelId,
	className,
}: RecordingControlsProps) {
	const recordingState = useAtomValue(readRecordingStateAtom(panelId));
	const webcamSelection = useAtomValue(readSelectedWebcamAtom(panelId));
	const startRecording = useSetAtom(startRecordingAtom(panelId));
	const stopRecording = useSetAtom(stopRecordingAtom(panelId));

	const isWebcamActive = webcamSelection?.deviceId !== null;

	const handleToggleRecording = () => {
		if (!isWebcamActive) return;

		if (recordingState.isRecording) {
			stopRecording();
		} else {
			startRecording();
		}
	};

	return (
		<div className={cn("flex items-center gap-2", className)}>
			{recordingState.isRecording && (
				<span className="text-xs text-muted-foreground font-mono">
					{Math.floor(recordingState.recordingDuration / 1000)}s
				</span>
			)}
			<RecordingButton
				isRecording={recordingState.isRecording}
				isDisabled={!isWebcamActive}
				onClick={handleToggleRecording}
			/>
		</div>
	);
}
