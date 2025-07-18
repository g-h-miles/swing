import { getGlassButtonStyles } from "@/lib/glass-styles";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Button } from "./ui/button";

type ButtonProps = React.ComponentProps<"button">;
export interface GlassButtonProps extends ButtonProps {
	/**
	 * Additional CSS classes to apply to the button
	 */
	className?: string;
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
	({ className, ...props }, ref) => {
		return (
			<Button
				ref={ref}
				variant="ghost"
				size="icon"
				className={cn(getGlassButtonStyles(), "cursor-pointer", className)}
				{...props}
			/>
		);
	},
);

GlassButton.displayName = "GlassButton";
