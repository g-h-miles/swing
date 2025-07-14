import { Button } from "@/components/ui/button";
import {
	PermissionButton,
	WebcamDropdown,
} from "@/components/webcam-dropdown_";
import { readAllowedWebcamsStateAtom } from "@/lib/stores/allowed-webcams";
import { atomStore } from "@/lib/stores/atom-store";
import {
	availableWebcamsAtom,
	readAvailableWebcamsAtom,
	readAvailableWebcamsLengthAtom,
} from "@/lib/stores/available-webcams-atom";
import {
	readWebcamAtom,
	setDeviceIdAtom,
	toggleVideoEnabledAtom,
} from "@/lib/stores/webcam-atom";
import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

export const Route = createFileRoute("/jotai")({
	component: RouteComponent,
});

const unsub = atomStore.sub(readAvailableWebcamsAtom, () => {
	console.log(
		"readAvailableWebcamsAtom changed to:",
		atomStore.get(readAvailableWebcamsAtom),
	);
});

function RouteComponent() {
	const panelId = "2";
	const selection = useAtomValue(readWebcamAtom(panelId));
	const setDeviceId = useSetAtom(setDeviceIdAtom(panelId));
	const toggleVideo = useSetAtom(toggleVideoEnabledAtom(panelId));
	const availableWebcams = useAtomValue(readAvailableWebcamsAtom);
	useEffect(() => {
		return () => {
			unsub();
		};
	}, []);

	// const availableWebcamsLength = useAtomValue(readAvailableWebcamsLengthAtom);
	// const allowedWebcamsState = useAtomValue(readAllowedWebcamsStateAtom);
	return (
		<div className="flex flex-col gap-4 w-4/5">
			{/* <pre>{JSON.stringify(availableWebcams, null, 2)}</pre> */}
			{/* <PermissionButton /> */}
			<WebcamDropdown panelId="1" />
		</div>
	);
}
