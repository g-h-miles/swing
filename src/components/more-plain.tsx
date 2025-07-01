import { useState } from "react";
import { Webcam } from "./ui/webcam";

export const MorePlain = () => {
	const [showCamera, setShowCamera] = useState(false);
	return (
		<>
			<button type="button" onClick={() => setShowCamera(!showCamera)}>
				{showCamera ? "Hide Camera" : "Show Camera"}
			</button>
			{showCamera && <Webcam />}
		</>
	);
};
