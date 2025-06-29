import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";
import { type ImperativePanelHandle} from "react-resizable-panels";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Fragment, useState, useRef, memo } from "react";
import { WebcamDropdown} from "./webcam-dropdown"
// import { useMeasure } from "@uidotdev/usehooks";
import { Webcam } from "./webcam";




// import { WebcamPlayer } from "@/components/window-player";

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
      <img src="/loft2.svg" alt="logo" className="w-24 h-16" />
    </div>
  );
}

const MemoizedWebcam = memo(Webcam);

export function ResizableDemo({ className }: { className?: string }) {
  // const [ref, { width, height }] = useMeasure();


  const panelOne = useRef<ImperativePanelHandle | null>(null);
  const panelTwoThree = useRef<ImperativePanelHandle | null>(null);
  const panelTwo = useRef<ImperativePanelHandle | null>(null);
  const panelThree = useRef<ImperativePanelHandle | null>(null);


  // const [panelOneMeasureRef, panelOneMeasure] = useMeasure();


  const [panelOneCamera, setPanelOneCamera] = useState<MediaDeviceInfo | null>(null);
  const [panelOneVideoEnabled, setPanelOneVideoEnabled] = useState(false);









  // useEffect(() => {
  //   const panelOneElement = getPanelElement("panel-one");
  //   if (panelOneElement) {
  //     panelOneMeasureRef(panelOneElement);
  //   refs.current = {
  //     panelOne: panelOneElement,
  //   };
  // }
  // }, []);

  const handleCameraSelect = (camera: MediaDeviceInfo) => {
    console.log("camera selected", camera);
    setPanelOneCamera(camera);
  }
  const handleVideoStart = () => {
    console.log("video started");
    setPanelOneVideoEnabled(true);
  }
  const handleVideoStop = () => {
    setPanelOneVideoEnabled(false);
  }


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
        id="panel-one"
        tagName="div"
        ref={panelOne}
        defaultSize={50}
        collapsible
        className="relative"
        onCollapse={() => {
          console.log("panel one collapsed");
          console.log("panel one", panelOne.current?.isCollapsed());

        }}
        onExpand={() => {
          console.log("panel one expanded");

        }}
        onResize={()=>{
        // setPanelOneWidth(document.getElementById("panel-one")?.offsetWidth ?? 0);
          if ((panelOne.current?.getSize() ?? 0.0) < 10) {
        panelOne.current?.collapse();
      } else if ((panelOne.current?.getSize() ?? 0.0) > 90.0) {
        panelOne.current?.resize(100);
      }
    }}
      >
        {/* <div className="flex h-full items-center justify-center p-6 ">
          <span className="font-semibold">One</span>
        </div> */}
        {/* <WebcamPlayer selectedDeviceId={null} /> */}
        <div className='absolute top-2 right-2 z-10'>
          <WebcamDropdown
            onCameraSelect={handleCameraSelect}
            onVideoStart={handleVideoStart}
            onVideoStop={handleVideoStop}
          />
        </div>
        {panelOneVideoEnabled && (
  <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
    <MemoizedWebcam
      mirrored={true}
      audio={true}
      muted={true}
      videoConstraints={{
        deviceId: panelOneCamera?.deviceId
      }}
      className="w-full h-full object-cover rounded-md shadow-lg"
      style={{
        maxWidth: '100%',
        maxHeight: '100%',
      }}
    />
  </div>
)}
      </ResizablePanel>

      <ResizableHandle
        className={cn("w-8",
"bg-transparent"
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
            onCollapse={() =>{} }
            onExpand={() => {}}

          >
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Two</span>
            </div>
          </ResizablePanel>
          <ResizableHandle
            className={
              "bg-transparent"

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
            onCollapse={() => {}}
            onExpand={() => {}}
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
