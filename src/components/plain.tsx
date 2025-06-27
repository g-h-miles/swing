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
import { GripVerticalIcon } from "lucide-react";

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

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
      <h1 className="text-xl md:text-2xl font-bold text-white">Header</h1>
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
      >
        <div className="flex h-full items-center justify-center p-6 ">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>

      <ResizableHandle
        className={
          isPanelOneCollapsed ? "bg-red-500" : "bg-border"
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
