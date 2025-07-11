import { atom, useAtomValue } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { atomFamily, atomWithStorage } from "jotai/utils";
import { cameraPermissionQueryOptions } from "@/lib/hooks/use-permission";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type WebcamSimple = {
	deviceId: string | null;
	videoEnabled: boolean;
};

export const webcamAtomFamily = atomFamily((key: string) => {
	const webcamAtom = atomWithStorage<WebcamSimple>(`webcam-atom-${key}`, {
		deviceId: null,
		videoEnabled: false,
	});

	return webcamAtom;
});

export const readWebcamAtom = atomFamily((key: string) => {
	return atom((get) => get(webcamAtomFamily(key)));
});

export const setDeviceIdAtom = atomFamily((key: string) => {
	return atom(null, (_get, set, deviceId: string | null) => {
		set(webcamAtomFamily(key), { videoEnabled: false, deviceId });
	});
});

export const toggleVideoEnabledAtom = atomFamily((key: string) => {
	return atom(null, (_get, set) => {
		set(webcamAtomFamily(key), (prev) => ({
			...prev,
			videoEnabled: !prev.videoEnabled,
		}));
	});
});


const permissionsQueryAtom = atomWithQuery(() => cameraPermissionQueryOptions)

export const useCameraPermissionValue = () => {
	const { data: permissionValue, isLoading, isError, refetch} = useAtomValue(permissionsQueryAtom);

	useEffect(() => {
		if (!permissionValue) return;
		
		const handlePermissionChange = async () => {
				await refetch();
			}

		permissionValue.addEventListener("change", handlePermissionChange);
		return () => {
			permissionValue.removeEventListener("change", handlePermissionChange);
		};
		
	}, [permissionValue, refetch]);

	return { permissionValue, isLoading, isError };

}