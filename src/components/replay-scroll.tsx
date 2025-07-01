import { glassStyles } from "@/glass";
import { cn } from "@/lib/utils";
import { Fragment } from "react/jsx-runtime";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

const tags = Array.from({ length: 50 }).map(
	(_, i, a) => `v1.2.0-beta.${a.length - i}`,
);

export function ReplayScroll({ className }: { className?: string }) {
	return (
		<ScrollArea
			className={cn(
				"rounded-xs border m-0",
				glassStyles.shadow,
				glassStyles.blur,
				className,
			)}
		>
			<div className="p-1">
				{tags.map((tag) => (
					<Fragment key={tag}>
						<div className="text-sm h-32 rounded-md border border-lime-400">
							<span className="text-xs bg-muted text-muted-foreground ml-1">
								{tag}
							</span>
						</div>
						<Separator className="my-2" />
					</Fragment>
				))}
			</div>
		</ScrollArea>
	);
}
