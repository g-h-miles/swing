// hooks/use-replays.ts
import { useQuery } from "@tanstack/react-query";

export interface ReplayData {
	id: string;
	url: string;
	title: string;
	thumbnail?: string;
	duration?: number;
	createdAt: Date;
}

const fetchDummyReplays = async (): Promise<ReplayData[]> => {
	// Simulate network delay
	await new Promise((resolve) => setTimeout(resolve, 800));

	return Array.from({ length: 50 }).map((_, i, a) => {
		const tag = `v1.2.0-beta.${a.length - i}`;
		return {
			id: `replay-${i}`,
			url: "https://www.diceui.com/assets/cloud.mp4",
			title: tag,
			createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // Stagger dates
		};
	});
};

export const replayQueryOptions = {
	queryKey: ["replays"],
	queryFn: fetchDummyReplays,
};

export const useReplays = () => {
	return useQuery(replayQueryOptions);
};
