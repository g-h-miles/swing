import { getBaseGlassStyles } from "@/glass";
import { cn } from "@/lib/utils";
import { Fragment } from "react/jsx-runtime";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

export const ReplayLoader = () => {
	return (
		<div className="h-full w-full py-1">
			<div
				className={cn(
					getBaseGlassStyles(),
					"relative h-full rounded-sm border ",
				)}
			>
				{Array.from({ length: 12 }).map((_, index) => (
					<Fragment key={`fragment-${Math.random()}`}>
						<div
							key={`loading-${Math.random()}`}
							data-index={index}
							className="min-h-16  rounded-sm hover:border hover:border-lime-400 relative"
						>
							<Skeleton
								key={`skeleton-${Math.random()}`}
								className="bg-gray-400 h-24 w-full rounded-md"
							/>
						</div>
						<Separator key={`separator-${Math.random()}`} className="my-2" />
					</Fragment>
				))}
			</div>
		</div>
	);
};
