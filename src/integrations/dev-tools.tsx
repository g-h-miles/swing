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
  return (
    <>
      <TanStackRouterDevtools position="bottom-left" />

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
    </>
  );
};
