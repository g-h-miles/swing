import { glassStyles } from "@/glass";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type ButtonProps = React.ComponentProps<typeof Button>;
export function GlassBtnBg({ ...props }: ButtonProps) {
	const { className, ...rest } = props;
	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={rest.onClick}
			className={cn(
				"z-10 h-10 w-10 transition-opacity duration-600 cursor-pointer",
				"fancy-fill",
				"bg-white/5",
				"bg-blend-overlay",
				glassStyles.border,
				glassStyles.buttonHover,
				className,
			)}
			aria-label="Scroll to top"
		>
			{rest.children}
		</Button>
	);
}
