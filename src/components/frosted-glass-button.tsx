import { getFrostedGlassButtonStyles } from "@/lib/glass-styles";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Button } from "./ui/button";

type ButtonProps = React.ComponentProps<"button">;
export interface FrostedGlassButtonProps extends ButtonProps {
	/**
	 * Additional CSS classes to apply to the button
	 */
	className?: string;
}

export const FrostedGlassButton = forwardRef<HTMLButtonElement, FrostedGlassButtonProps>(
	({ className, ...props }, ref) => {
		return (
			<Button
				ref={ref}
				variant="ghost"
				size="icon"
				className={cn(getFrostedGlassButtonStyles(), "cursor-pointer", className)}
				{...props}
			/>
		);
	},
);

FrostedGlassButton.displayName = "FrostedGlassButton";