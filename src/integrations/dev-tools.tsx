import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { HammerIcon } from "@phosphor-icons/react";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useAtom } from "jotai";
import { DevTools as JotaiDevTools } from "jotai-devtools";
import { atomWithStorage } from "jotai/utils";
import TanStackQueryLayout from "../integrations/tanstack-query/layout";

const devToolAtom = atomWithStorage("dev-tool-panel", false);

export const DevTools = () => {
	const [devToolPanel, setDevToolPanel] = useAtom(devToolAtom);
	return (
		<div className="fixed bottom-0 left-0 right-0 flex justify-center w-full">
			<Collapsible
				className="w-full"
				open={devToolPanel}
				onOpenChange={setDevToolPanel}
			>
				<CollapsibleTrigger className="flex items-center gap-1 bg-transparent px-3 py-1 text-sm text-white rounded-tr-lg border-t border-l border-r border-gray-800 cursor-pointer">
					<HammerIcon className="h-4 w-4 pr-1" />
					<span>Dev Tools</span>
				</CollapsibleTrigger>
				<CollapsibleContent className=" bg-transparent p-2 w-full h-14 border-t">
					<div className="flex items-center gap-2">
						<div className="[&>*]:!static">
							<TanStackRouterDevtools position="bottom-left" />
						</div>
						<div className="!size-4">
							<style>
								{`
											.jotai-devtools-trigger-button {
												width: 3rem !important;
												height: 3rem !important;
                        z-index: 1000;
											}
										`}
							</style>
							<JotaiDevTools position="bottom-right" />
						</div>
						<TanStackQueryLayout />
					</div>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
};
