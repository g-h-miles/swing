import { cn } from "@/lib/utils";
import { glassStyles } from "./webcam-dropdown";
export type WebcamStatus = "ready" | "live" | "replay" | "inactive";

const statusMap: Record<WebcamStatus, { label: string; color: string }> = {
	inactive: { label: "Inactive", color: "red" }, // gray
	ready: { label: "Ready", color: "#6B7280" }, // gray
	live: { label: "Live", color: "#10B981" }, // green
	replay: { label: "Replay", color: "#2563EB" }, // blue
};

export function WebcamStatusText({ status }: { status: WebcamStatus }) {
	const { label, color } = statusMap[status];

	return (
		<div
			className={cn(
				`${glassStyles.menuItem} ${glassStyles.hover} focus:${glassStyles.hover.replace("hover:", "")} ${glassStyles.borderRadius} ${glassStyles.transition} font-medium ${glassStyles.primaryText} text-sm`,
				"flex items-center gap-1 text-xs font-mono bg-white/10 cursor-default",
			)}
		>
			<span
				style={{
					width: 6,
					height: 6,
					borderRadius: "50%",
					backgroundColor: color,
				}}
			/>
			{label}
		</div>
	);
}
