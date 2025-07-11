import { replayQueryOptions } from "@/lib/hooks/use-replays";
import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { atomFamily, atomWithStorage, createJSONStorage } from "jotai/utils";

export type ReplayState =
	| "mounting"
	| "loading"
	| "playing"
	| "paused"
	| "ended"
	| "error";

export interface ReplayPlayerState {
	id: string;
	state: ReplayState;
	volume: number;
	playbackRate: number;
	currentTime: number;
	duration: number;
}

// Query atom for all replays
export const replaysQueryAtom = atomWithQuery(() => replayQueryOptions);

export const replaysIdTitleAtom = atom((get) => {
	const { data, isLoading, isSuccess, error } = get(replaysQueryAtom);

	if (isSuccess) {
		return {
			data: data.map((replay) => ({
				id: replay.id,
				title: replay.title,
			})),
			isLoading,
			error,
		};
	}
	return {
		data: [],
		isLoading,
		error,
	};
});
export const isPlayingAllReplaysAtom = atomWithStorage(
	"play-all-replays",
	false,
);

const playingIdsStorage = createJSONStorage<string[]>(() => localStorage);

const playingReplayIdsAtom = atomWithStorage<string[]>(
	"playing-replay-ids",
	[],
	playingIdsStorage,
);

export const shouldPlayReplayAtomFamily = atomFamily((replayId: string) =>
	atom((get) => get(playingReplayIdsAtom).includes(replayId)),
);

const replayStateBaseAtomFamily = atomFamily((replayId: string) =>
	atom<ReplayPlayerState>({
		id: replayId,
		state: "mounting",
		volume: 1,
		playbackRate: 1,
		currentTime: 0,
		duration: 0,
	}),
);

// Atom family for individual replay states
export const replayStateAtomFamily = atomFamily((replayId: string) =>
	atom(
		(get) => {
			const isPlaying = get(playingReplayIdsAtom).includes(replayId);
			const currentState = get(replayStateBaseAtomFamily(replayId));
			return {
				...currentState,
				state: isPlaying ? "playing" : currentState.state,
			};
		},
		(_get, set, newValue: ReplayPlayerState) => {
			set(replayStateBaseAtomFamily(replayId), newValue);
		},
	),
);

const replayDataAtomFamily = atomFamily((replayId: string) =>
	atom((get) => {
		const replaysQuery = get(replaysQueryAtom);
		if (replaysQuery.status === "success") {
			return replaysQuery.data.find((replay) => replay.id === replayId) || null;
		}
		return null;
	}),
);

export const replayAtomFamily = atomFamily((replayId: string) =>
	atom(
		(get) => {
			const state = get(replayStateAtomFamily(replayId));
			const data = get(replayDataAtomFamily(replayId));
			return {
				...state,
				data,
			};
		},
		(get, set, update: Partial<ReplayPlayerState>) => {
			const current = get(replayStateAtomFamily(replayId));
			set(replayStateAtomFamily(replayId), {
				...current,
				...update,
			});
		},
	),
);

export const readReplayStateAtomFamily = atomFamily((replayId: string) =>
	atom((get) => get(replayStateAtomFamily(replayId)).state),
);

export const writeReplayStateAtomFamily = atomFamily((replayId: string) =>
	atom(null, (_get, set, newValue: ReplayState) => {
		const current = _get(replayStateAtomFamily(replayId));
		set(replayStateAtomFamily(replayId), {
			...current,
			state: newValue,
		});
	}),
);

export const readReplayPlayerURLAtomFamily = atomFamily((replayId: string) =>
	atom((get) => get(replayAtomFamily(replayId)).data?.url),
);

export const onPlayReplayAtomFamily = atomFamily((replayId: string) =>
	atom(null, (_get, set) => {
		const currentState = _get(replayStateAtomFamily(replayId));
		if (currentState.state !== "playing") {
			const currentPlayingIds = _get(playingReplayIdsAtom);
			if (!currentPlayingIds.includes(replayId)) {
				set(playingReplayIdsAtom, [...currentPlayingIds, replayId]);
			}
			set(replayStateAtomFamily(replayId), {
				...currentState,
				state: "playing",
			});
		}
	}),
);

export const onPauseReplayAtomFamily = atomFamily((replayId: string) =>
	atom(null, (_get, set) => {
		const currentState = _get(replayStateAtomFamily(replayId));
		if (currentState.state !== "paused") {
			const currentPlayingIds = _get(playingReplayIdsAtom);
			set(
				playingReplayIdsAtom,
				currentPlayingIds.filter((id) => id !== replayId),
			);
			set(replayStateAtomFamily(replayId), {
				...currentState,
				state: "paused",
			});
		}
		set(isPlayingAllReplaysAtom, false);
	}),
);

export const onLoadedMetadataReplayAtomFamily = atomFamily((replayId: string) =>
	atom(null, (_get, set) => {
		const currentState = _get(replayStateAtomFamily(replayId));
		if (currentState.state === "mounting") {
			set(replayStateAtomFamily(replayId), {
				...currentState,
				state: "paused",
			});
		}
	}),
);

export const togglePlayAllAtom = atom(null, (get, set) => {
	const replaysQuery = get(replaysQueryAtom);

	if (replaysQuery.status !== "success") return;

	if (get(isPlayingAllReplaysAtom)) {
		// clear storage
		set(playingReplayIdsAtom, []);

		// Pause all - call individual pause atoms
		replaysQuery.data.forEach((replay) => {
			const pauseAtom = onPauseReplayAtomFamily(replay.id);
			set(pauseAtom);
		});
		set(isPlayingAllReplaysAtom, false);
	} else {
		// Play all - call individual play atoms
		replaysQuery.data.forEach((replay) => {
			const playAtom = onPlayReplayAtomFamily(replay.id);
			set(playAtom);
		});
		set(isPlayingAllReplaysAtom, true);
	}
});
