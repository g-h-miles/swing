export const glassStyles = {
	background: "bg-white/5",
	blur: "backdrop-blur-md",
	border: "border border-white/20",
	borderRadius: "rounded-sm",
	shadow: "shadow-[0_4px_24px_rgba(0,0,0,0.28)]",
	transition: "transition-all duration-300",
	hover: "hover:bg-white/10",
	selected: "bg-white/15",
	buttonHover:
		"hover:!bg-white/10 hover:border-white/40 hover:shadow-[0_8px_32px_rgba(255,255,255,0.05)] data-[state=open]:!bg-white/10",
	primaryText: "text-white",
	mutedText: "text-white/70",
	menuItem: "flex items-center gap-2 px-2 py-1.5 cursor-pointer",
	indicator: "bg-white",
} as const;

export const frostedGlassStyles = {
	...glassStyles,
	transition: "transition-all duration-600",
	fancyFill: "fancy-fill",
	blendMode: "bg-blend-overlay",
} as const;

export const getBaseGlassStyles = (): string => {
	return `${glassStyles.background} ${glassStyles.blur} ${glassStyles.border} ${glassStyles.borderRadius} ${glassStyles.shadow} ${glassStyles.transition}`;
};

export const getFrostedGlassStyles = (): string => {
	return `${frostedGlassStyles.background} ${frostedGlassStyles.blur} ${frostedGlassStyles.border} ${frostedGlassStyles.borderRadius} ${frostedGlassStyles.shadow} ${frostedGlassStyles.transition} ${frostedGlassStyles.fancyFill} ${frostedGlassStyles.blendMode}`;
};

export const getGlassButtonStyles = (): string => {
	return `${getBaseGlassStyles()} ${glassStyles.buttonHover} z-10 h-10 w-10 transition-opacity duration-300`;
};

export const getFrostedGlassButtonStyles = (): string => {
	return `z-10 h-10 w-10 transition-opacity duration-600 cursor-pointer fancy-fill ${getBaseGlassStyles()} bg-blend-overlay`;
};

export const getGlassMenuItemStyles = (): string => {
	return `${glassStyles.menuItem} ${glassStyles.hover} focus:${glassStyles.hover.replace("hover:", "")} ${glassStyles.borderRadius} ${glassStyles.transition} font-medium ${glassStyles.primaryText} text-sm`;
};

export const getGlassMenuContainerStyles = (): string => {
	return `${glassStyles.background} ${glassStyles.blur} ${glassStyles.border} ${glassStyles.borderRadius} ${glassStyles.shadow}`;
};

export type GlassContext = "webcam" | "replay" | "menu" | "base";

export const getGlassStylesByContext = (context: GlassContext): string => {
	switch (context) {
		case "webcam":
			return getGlassButtonStyles();
		case "replay":
			return getFrostedGlassButtonStyles();
		case "menu":
			return getGlassMenuContainerStyles();
		case "base":
			return getBaseGlassStyles();
		default:
			return getBaseGlassStyles();
	}
};

export const glassVariants = {
	base: getBaseGlassStyles(),
	button: getGlassButtonStyles(),
	frostedButton: getFrostedGlassButtonStyles(),
	menuItem: getGlassMenuItemStyles(),
	menuContainer: getGlassMenuContainerStyles(),
} as const;

export type GlassVariant = keyof typeof glassVariants;
