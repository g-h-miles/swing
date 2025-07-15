import { atom } from "jotai";
import { atomFamily } from "jotai/utils";

export interface PermissionState {
	state: PermissionStatus["state"] | "prompt" | "mounting";
	isLoading: boolean;
	error: string | null;
}

const INIT = Symbol("init");

const initialPermissionState: PermissionState = {
	state: "mounting",
	isLoading: true,
	error: null,
};

export const permissionAtomFamily = atomFamily((name: PermissionName) => {
	let init: symbol | null = INIT;
	const anAtom = atom<PermissionState>(initialPermissionState);

	anAtom.onMount = (setAtom) => {
		if (typeof navigator === "undefined" || !navigator.permissions) {
			setAtom({
				state: "denied",
				isLoading: false,
				error: "Permissions API is not supported",
			});
			return;
		}

		let permissionStatus: PermissionStatus | null = null;

		const queryPermission = async () => {
			try {
				permissionStatus = await navigator.permissions.query({ name });
				setAtom({
					state: permissionStatus.state,
					isLoading: false,
					error: null,
				});
				permissionStatus.onchange = () => {
					if (init === INIT) {
						init = null;
						return;
					}
					console.log("permissionStatus changed");
					if (!permissionStatus) return;
					setAtom({
						state: permissionStatus.state,
						isLoading: false,
						error: null,
					});
				};
			} catch (error) {
				setAtom({
					state: "denied",
					isLoading: false,
					error:
						error instanceof Error
							? `Error querying ${name} permission: ${error.message}`
							: "Unknown error",
				});
			}
		};

		queryPermission();

		return () => {
			if (permissionStatus) {
				permissionStatus.onchange = null;
			}
		};
	};

	return anAtom;
});

export const cameraPermissionAtom = permissionAtomFamily("camera");

export const readCameraPermissionAtom = atom(
	(get) => get(cameraPermissionAtom).state,
);

export const readIsCameraPermissionGrantedAtom = atom(
	(get) => get(cameraPermissionAtom).state === "granted",
);

export const readCameraPermissionIsLoadingAtom = atom(
	(get) => get(cameraPermissionAtom).isLoading,
);

export const readCameraPermissionErrorAtom = atom(
	(get) => get(cameraPermissionAtom).error,
);
