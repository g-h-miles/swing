import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/** @public */
export const safeJsonParse = <T>(str: string) => {
	try {
		const jsonValue: T = JSON.parse(str);

		return jsonValue;
	} catch {
		return undefined;
	}
};
