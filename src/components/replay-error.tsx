import { getBaseGlassStyles } from "@/glass";
import { cn } from "@/lib/utils";

export const ReplayError = () => {
	return (
		<div
			className={cn(
				getBaseGlassStyles(),
				"relative h-full rounded-sm border flex items-center justify-center",
			)}
		>
			<span className="text-sm text-red-500">Error loading replays</span>
		</div>
	);
};
