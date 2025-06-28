"use client"

import type React from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Camera, Video, VideoOff, Settings } from "lucide-react"

// Glass effect variables
const glassStyles = {
  background: "bg-white/5",
  blur: "backdrop-blur-md",
  border: "border border-white/20",
  borderRadius: "rounded-sm",
  shadow: "shadow-[0_8px_32px_rgba(0,0,0,0.1)]",
  hover: "hover:bg-white/10",
  selected: "bg-white/15",
  buttonHover:
    "hover:!bg-white/10 hover:border-white/40 hover:shadow-[0_8px_32px_rgba(255,255,255,0.05)] data-[state=open]:!bg-white/10",
  transition: "transition-all duration-300",
  primaryText: "text-white",
  mutedText: "text-white/70",
  menuItem: "flex items-center gap-2 px-2 py-1.5 cursor-pointer",
  indicator: "bg-white",
} as const

interface MenuItemProps {
  icon: React.ReactNode
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

const MenuItem = ({ icon, children, className = "", onClick }: MenuItemProps) => (
  <DropdownMenuItem
    onClick={onClick}
    className={`${glassStyles.menuItem} ${glassStyles.hover} focus:${glassStyles.hover.replace("hover:", "")} ${glassStyles.borderRadius} ${glassStyles.transition} font-medium ${glassStyles.primaryText} text-sm ${className}`}
  >
    {icon}
    <span>{children}</span>
  </DropdownMenuItem>
)

export function WebcamDropdown() {
  const [selectedCamera, setSelectedCamera] = useState("Built-in Camera")
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)

  const cameras = [
    { id: "builtin", name: "Built-in Camera", status: "active" },
    { id: "external", name: "External USB Camera", status: "available" },
    { id: "virtual", name: "Virtual Camera", status: "available" },
  ]

  const handleCameraSelect = (cameraName: string) => {
    setSelectedCamera(cameraName)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`flex items-center gap-2 px-4 py-2 h-auto w-48 ${glassStyles.background} ${glassStyles.blur} ${glassStyles.border} ${glassStyles.borderRadius} ${glassStyles.shadow} ${glassStyles.buttonHover} ${glassStyles.transition} ${glassStyles.primaryText}`}
        >
          <Video className="w-4 h-4" />
          <span className="text-sm font-medium truncate flex-1">{selectedCamera}</span>
          <ChevronDown className="w-3 h-3 transition-transform duration-300 data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={`w-56 ${glassStyles.background} ${glassStyles.blur} ${glassStyles.border} ${glassStyles.borderRadius} ${glassStyles.shadow} p-0 mt-2`}
        align="end"
        side="bottom"
        sideOffset={4}
        alignOffset={0}
        avoidCollisions={false}
      >
        {/* Available Cameras */}
        <div className="p-1">
          {cameras.map((camera) => (
            <DropdownMenuItem
              key={camera.id}
              onClick={() => handleCameraSelect(camera.name)}
              className={`${glassStyles.menuItem} ${glassStyles.hover} focus:${glassStyles.hover.replace("hover:", "")} ${glassStyles.borderRadius} ${glassStyles.transition} ${glassStyles.primaryText} text-sm ${
                selectedCamera === camera.name ? glassStyles.selected : ""
              }`}
            >
              <Camera className="w-3 h-3" />
              <span className="flex-1 font-medium">{camera.name}</span>
              {selectedCamera === camera.name && (
                <div className={`w-1.5 h-1.5 ${glassStyles.indicator} rounded-full`} />
              )}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator className={`my-1 ${glassStyles.border}`} />

          {/* Camera Controls */}
          <MenuItem
            icon={isVideoEnabled ? <VideoOff className="w-3 h-3" /> : <Video className="w-3 h-3" />}
            onClick={() => setIsVideoEnabled(!isVideoEnabled)}
          >
            {isVideoEnabled ? "Turn Off" : "Turn On"}
          </MenuItem>

          <MenuItem icon={<Settings className="w-3 h-3" />}>Settings</MenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
