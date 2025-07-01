import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getAvailableWebcams } from "../webcams";

export function useAvailableWebcamsQuery() {
	const queryClient = useQueryClient();

	const query = useQuery({
		queryKey: ["webcams"],
		queryFn: getAvailableWebcams,
		retry: 1,
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
		refetchOnMount: true,
		staleTime: 0,
	});

	useEffect(() => {
		const handleDeviceChange = () => {
			console.log("Device changed");
			queryClient.invalidateQueries({ queryKey: ["webcams"] });
		};

		navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);

		return () => {
			navigator.mediaDevices.removeEventListener(
				"devicechange",
				handleDeviceChange,
			);
		};
	}, [queryClient]);

	return query;
}
