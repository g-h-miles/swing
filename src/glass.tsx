export const glassStyles = {
	background: "bg-white/5",
	blur: "backdrop-blur-md",
	border: "border border-white/20",
	borderRadius: "rounded-sm",
	shadow: "shadow-[0_4px_24px_rgba(0,0,0,0.28)]",
	hover: "hover:bg-white/10",
	selected: "bg-white/15",
	buttonHover:
		"hover:!bg-white/10 hover:border-white/40 hover:shadow-[0_8px_32px_rgba(255,255,255,0.05)] data-[state=open]:!bg-white/10",
	transition: "transition-all duration-300",
	primaryText: "text-white",
	mutedText: "text-white/70",
	menuItem: "flex items-center gap-2 px-2 py-1.5 cursor-pointer",
	indicator: "bg-white",
};

export const getBaseGlassStyles = () => {
	return `${glassStyles.background} ${glassStyles.blur} ${glassStyles.border} ${glassStyles.borderRadius} ${glassStyles.shadow} ${glassStyles.transition}`;
};
