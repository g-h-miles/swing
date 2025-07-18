import { cn } from "@/lib/utils";
import {
	CircleIcon as Circle,
	SquareIcon as Square,
	ProhibitIcon as Prohibit,
} from "@phosphor-icons/react";
import { GlassButton } from "./glass-button";

interface RecordingButtonProps {
	isRecording: boolean;
	isDisabled?: boolean;
	onClick: () => void;
	className?: string;
}

export function RecordingButton({
	isRecording,
	isDisabled = false,
	onClick,
	className,
}: RecordingButtonProps) {
	return (
		<GlassButton 
			onClick={onClick} 
			disabled={isDisabled}
			className={cn(className)}
		>
			{isDisabled ? (
				<Prohibit size={16} weight="fill" className="fill-gray-500" />
			) : isRecording ? (
				<Square size={16} weight="fill" className="fill-red-500" />
			) : (
				<Circle size={16} weight="fill" className="fill-red-500" />
			)}
		</GlassButton>
	);
}
