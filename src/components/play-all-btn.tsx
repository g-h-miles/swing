import {
	isPlayingAllReplaysAtom,
	togglePlayAllAtom,
} from "@/lib/stores/replay-atom";
import { PlayIcon, StopIcon } from "@phosphor-icons/react";
import { useAtomValue, useSetAtom } from "jotai";
import { FrostedGlassButton } from "./frosted-glass-button";

export const PlayAllBtn = () => {
	const isPlayingAll = useAtomValue(isPlayingAllReplaysAtom);
	const togglePlayAll = useSetAtom(togglePlayAllAtom);

	return (
		<FrostedGlassButton onClick={togglePlayAll} className="scroll-anchor-target">
			{!isPlayingAll ? (
				<PlayIcon className="size-4" />
			) : (
				<StopIcon className="size-4" />
			)}
		</FrostedGlassButton>
	);
};
