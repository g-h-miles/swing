import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function LayoutAddition() {
	return (
		<div className="absolute bottom-0 flex justify-center w-full">
			<ReactQueryDevtools buttonPosition="relative" />
		</div>
	);
}
