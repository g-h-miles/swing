interface UpsideDownTabProps {
	color?: string;
	lineThickness?: number;
	roundness?: number;
	className?: string;
}

export const UpsideDownTab: React.FC<UpsideDownTabProps> = ({
	lineThickness = 12,
	roundness = 15,
	className,
}) => {
	const r = Math.max(0, roundness);

	const yTop = 25;
	const yBottom = 85;
	const xStart = 10;
	const xEnd = 190;
	const xDipStart = 40 + r;
	const xDipEnd = 160 - r;

	const pathData = [
		`M ${xStart},${yTop}`, // far left
		// `L ${xDipStart - 40},${yTop}`, // left flat arm
		`C ${xDipStart - 25},${yTop + 60} ${xDipStart - 10},${yBottom} ${xDipStart},${yBottom}`, // left curve down
		`L ${xDipEnd},${yBottom}`, // bottom flat
		`C ${xDipEnd + 10},${yBottom} ${xDipEnd + 25},${yTop + 60} ${xDipEnd + 40},${yTop}`, // right curve up
		// `L ${xEnd},${yTop}`, // far right flat arm
	].join(" ");

	return (
		<svg
			viewBox="0 0 200 100"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<title>upside-down-tab</title>
			<path
				d={pathData}
				// fill="none"
				// stroke="currentColor"
				strokeWidth={lineThickness}
				strokeLinecap="square"
				strokeLinejoin="miter"
			/>
		</svg>
	);
};
