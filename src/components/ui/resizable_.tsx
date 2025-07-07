import * as React from "react"
import { DotsSixVerticalIcon } from "@phosphor-icons/react"
import * as ResizablePrimitive from "react-resizable-panels"
import { UpsideDownTab } from "@/components/upside-down-tab"

import { cn } from "@/lib/utils"

function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
  return (
    <ResizablePrimitive.PanelGroup
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function ResizablePanel({
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
}

function ResizableHandle({
  direction = "vertical",
  handleType,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  handleType?: "default" | "collapsed-top" | "collapsed-bottom" | "collapsed-left" | "collapsed-right"
  direction?: "horizontal" | "vertical"
}) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        "bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1",
         "focus-visible:outline-hidden ",
         "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0 data-[panel-group-direction=vertical]:after:-translate-y-1/2 [&[data-panel-group-direction=vertical]>div]:rotate-90",
        className
      )}
      {...props}
    >
      {handleType === "default" && (
        <div className="bg-transparent z-10 flex h-4 w-3 items-center justify-center rounded-xs ">
          <DotsSixVerticalIcon className="size-4 fill-border" />
        </div>
      )}
      {handleType === "collapsed-top" && (
      <div className="absolute top-0 h-4 w-3 left-1/2 -translate-x-1/2 z-10 ">
      <div className="relative flex items-center justify-center h-full w-full">
        <UpsideDownTab
          // color="currentColor"
          className="absolute h-6 stroke-border rotate-270"
          lineThickness={4}
          roundness={15}
        />
      <DotsSixVerticalIcon className="w-4 fill-border relative" />
    </div>
</div>
      )}
      {handleType === "collapsed-bottom" && (
          <div className="absolute bottom-0 h-4 w-3 left-1/2 -translate-x-1/2 z-10 ">
      <div className="relative flex items-center justify-center h-full w-full">
        <UpsideDownTab
          // color="currentColor"
          className="absolute h-6 stroke-border rotate-90"
          lineThickness={4}
          roundness={15}
        />
      <DotsSixVerticalIcon className="w-4 fill-border relative" />
    </div>
</div>
      )}
      {handleType === "collapsed-left" && (
                  <div className="bg-transparent absolute bottom-0 w-3 h-4 top-1/2 -translate-y-1/2 z-10 ">
      <div className="relative flex items-center justify-center h-full w-full">
        <UpsideDownTab
          // color="currentColor"
          className="absolute h-6 stroke-border rotate-90"
          lineThickness={4}
          roundness={15}
        />
      <DotsSixVerticalIcon className="w-4 fill-border relative" />
    </div>
</div>
      )}
            {handleType === "collapsed-right" && (
                  <div className="bg-transparent absolute bottom-0 w-4 h-3 top-1/2 -translate-y-1/2 z-10 ">
      <div className="relative flex items-center justify-center h-full w-full">
        <UpsideDownTab
          // color="currentColor"
          className="absolute h-6 stroke-border rotate-270"
          lineThickness={4}
          roundness={15}
        />
      <DotsSixVerticalIcon className="h-4 fill-border relative" />
    </div>
</div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
