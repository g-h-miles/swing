import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Fragment } from "react"

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

export const Plain = () => {
  return (
    <div className="flex w-full h-screen fancy-background">
      <div className="w-full h-full flex flex-col">
        <Header />

        <div className="flex flex-1 min-h-0">
          <ResizableDemo className="ml-4 mr-1"/>
          <ScrollAreaDemo className="flex-1 mr-4"/>
        </div>

      </div>
    </div>
  )
}


export function Header() {
  return (
    <div className="w-full h-20 ">
      <h1 className="text-2xl font-bold text-white">Header</h1>
    </div>
  )
}


export function ResizableDemo({className}: {className?: string}) {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className={cn("max-w-[min(80%,_2000px)] rounded-xs border border-border md:min-w-[450px]  h-full", className)}
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle className="bg-border" withHandle/>
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={25}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Two</span>
            </div>
          </ResizablePanel>
          <ResizableHandle className="bg-border" withHandle/>
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}


export function ScrollAreaDemo({ className }: { className?: string}) {
  return (
    <ScrollArea className={cn("rounded-xs border m-0", className)}>
      <div className="p-1">
        {tags.map((tag) => (
          <Fragment key={tag}>
            <div className="text-sm h-32"><span className="text-xs bg-muted text-muted-foreground">{tag}</span></div>
            <Separator className="my-2" />
          </Fragment>
        ))}
      </div>
    </ScrollArea>
  )
}
