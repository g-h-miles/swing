import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";
import { type ImperativePanelHandle } from "react-resizable-panels";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Fragment, useState, useRef } from "react";
import { WebcamDropdown} from "./webcam-dropdown"
import { User, Settings, Bell, Palette, LogOut, ChevronDown } from "lucide-react";

// import { WebcamPlayer } from "@/components/window-player";

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

  const dropdownItems = [
    { icon: User, label: "Profile", action: () => console.log("Profile clicked") },
    { icon: Settings, label: "Settings", action: () => console.log("Settings clicked") },
    { icon: Bell, label: "Notifications", action: () => console.log("Notifications clicked") },
    { icon: Palette, label: "Appearance", action: () => console.log("Appearance clicked") },
    { icon: LogOut, label: "Sign Out", action: () => console.log("Sign out clicked"), variant: "danger" as const },
  ]

export const Plain = () => {
  return (
    <div className="flex w-full h-screen fancy-background">
      <div className="w-full h-full flex flex-col">
        <Header />

        <div className="flex flex-1 min-h-0 overflow-hidden px-4 pb-4">
          <ResizableDemo className="mr-3 flex-shrink-0" />
          <ScrollAreaDemo className="flex-1" />
        </div>
      </div>
    </div>
  );
};

export function Header() {
  return (
    <div className="w-full h-16 md:h-20 flex-shrink-0 px-4 pt-4">
      <img src="/loft2.svg" alt="logo" className="w-24 h-16" />
    </div>
  );
}

export function ResizableDemo({ className }: { className?: string }) {
  const panelOne = useRef<ImperativePanelHandle | null>(null);
  const panelTwoThree = useRef<ImperativePanelHandle | null>(null);
  const panelTwo = useRef<ImperativePanelHandle | null>(null);
  const panelThree = useRef<ImperativePanelHandle | null>(null);

  const [isPanelOneCollapsed, setIsPanelOneCollapsed] = useState(false);
  const [isPanelTwoCollapsed, setIsPanelTwoCollapsed] = useState(false);
  const [isPanelThreeCollapsed, setIsPanelThreeCollapsed] = useState(false);

  return (
    <ResizablePanelGroup
      autoSaveId={"cam-layout"}
      direction="horizontal"
      className={cn(
        "w-full max-w-[min(80%,_2000px)] rounded-xs border border-border md:min-w-[450px] h-full",
        className
      )}
    >
      <ResizablePanel
        ref={panelOne}
        defaultSize={50}
        collapsible
        onCollapse={() => {
          console.log("panel one collapsed");
          console.log("panel one", panelOne.current?.isCollapsed());
          setIsPanelOneCollapsed(true);
        }}
        onExpand={() => {
          console.log("panel one expanded");
          setIsPanelOneCollapsed(false);
        }}
        onResize={() => {
          if ((panelOne.current?.getSize() ?? 0.0) < 10) {
            panelOne.current?.collapse();
          } else {
            if ((panelOne.current?.getSize() ?? 0.0) > 90.0) {
              panelOne.current?.resize(100);
            }
          }
        }}
      >
        {/* <div className="flex h-full items-center justify-center p-6 ">
          <span className="font-semibold">One</span>
        </div> */}
        {/* <WebcamPlayer selectedDeviceId={null} /> */}
        <div className='flex justify-end pt-2 pr-2'>
        <WebcamDropdown />
        </div>
      </ResizablePanel>

      <ResizableHandle
        className={cn("w-8",
          isPanelOneCollapsed ? "bg-red-500" : "bg-transparent"
        )
        }
        withHandle
        onDoubleClick={() => {
          if (
            panelOne.current?.isCollapsed() ||
            (panelOne.current?.getSize() ?? 0.0) == 100.0
          ) {
            panelOne.current?.resize(50);
          } else {
            console.log("panel one size", panelOne.current?.getSize());
            console.log(
              "panel one",
              (panelOne.current?.getSize() ?? 0.0) <= 50.0
            );
            if ((panelOne.current?.getSize() ?? 0.0) < 50.0) {
              console.log("collapsing panel one");
              panelOne.current?.collapse();
            } else {
              console.log("resizing panel one to 100");
              panelOne.current?.resize(100);
            }
          }
        }}
      >
        <div></div>
      </ResizableHandle>
      <ResizablePanel defaultSize={50} ref={panelTwoThree} collapsible>
        <ResizablePanelGroup direction="vertical" autoSaveId="cam-layout-right">
          <ResizablePanel defaultSize={50} ref={panelTwo} collapsible
            onCollapse={() => setIsPanelTwoCollapsed(true)}
            onExpand={() => setIsPanelTwoCollapsed(false)}

          >
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Two</span>
            </div>
          </ResizablePanel>
          <ResizableHandle
            className={
              isPanelTwoCollapsed || isPanelThreeCollapsed
                ? "bg-transparent"
                : "bg-border"
            }
            withHandle
            onDoubleClick={() => {
              console.log("panel two double clicked");
              console.log("panel two", panelTwo.current?.isCollapsed());
              if (
                panelTwo.current?.isCollapsed() ||
                panelThree.current?.isCollapsed()
              ) {
                panelTwo.current?.resize(50);
              } else {
                if ((panelTwo.current?.getSize() ?? 0.0) < 50.0) {
                  panelTwo.current?.collapse();
                } else {
                  panelThree.current?.collapse();
                }
              }
            }}
          >
            <div></div>
          </ResizableHandle>
          <ResizablePanel defaultSize={50} ref={panelThree} collapsible
            onCollapse={() => setIsPanelThreeCollapsed(true)}
            onExpand={() => setIsPanelThreeCollapsed(false)}
          >
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export function ScrollAreaDemo({ className }: { className?: string }) {
  return (
    <ScrollArea className={cn("rounded-xs border m-0", className)}>
      <div className="p-1">
        {tags.map((tag) => (
          <Fragment key={tag}>
            <div className="text-sm h-32">
              <span className="text-xs bg-muted text-muted-foreground">
                {tag}
              </span>
            </div>
            <Separator className="my-2" />
          </Fragment>
        ))}
      </div>
    </ScrollArea>
  );
}
