import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";

export const Route = createFileRoute("/getFiles")({
	component: RouteComponent,
});

function RouteComponent() {
	const [testdata, setData] = useState(null);
	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch(
					"https://backend-convex.mlcr.us/http/test",
				);
				const result = await response.json();
				setData(result);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		}
		fetchData();
	}, []);

	const { data } = useQuery(convexQuery(api.replay.listAllFiles, {}));
	return (
		<div>
			<div>Hello "/getFiles"!</div>
			<div className="flex flex-col">
				{data?.map((file) => (
					<div key={file._id}>
						{file._id}:{file.contentType}:{file.size}
					</div>
				))}
			</div>
			<div>{JSON.stringify(testdata)}</div>
		</div>
	);
}
