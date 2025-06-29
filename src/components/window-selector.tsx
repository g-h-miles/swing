"use client"

import { useState, useEffect } from "react"
import { useAvailableWebcams } from '@/lib/hooks/use-available-webcams'
import { useCameraPermission, useMicrophonePermission } from '@/lib/hooks/use-permission'
import { requestCameraAndMicrophoneStream } from "@/lib/webcams"
import { Webcam } from "./webcam"

interface WindowContent {
  id: number
  title: string
  content: React.ReactNode
  color: string
}

export default function WindowSelector() {
  const { data, isLoading, isError } = useAvailableWebcams()

  const createInitialWindows = (deviceId: string | null): WindowContent[] => [
    {
      id: 1,
      title: "Dashboard",
      content: <Webcam audio={true} videoConstraints={{ deviceId: deviceId ?? undefined }} />,
      color: "bg-blue-50 border-blue-200",
    },
    {
      id: 2,
      title: "Analytics",
      content:
        "Detailed analytics and reporting section. View user behavior, conversion rates, and detailed insights about your application's performance.",
      color: "bg-green-50 border-green-200",
    },
    {
      id: 3,
      title: "Settings",
      content:
        "Application settings and configuration panel. Manage user preferences, system settings, and customize your application experience.",
      color: "bg-purple-50 border-purple-200",
    },
  ]

  const [activeWindow, setActiveWindow] = useState<WindowContent>()
  const [smallWindows, setSmallWindows] = useState<WindowContent[]>([])

  // Update windows when webcam data changes
  useEffect(() => {
    const windows = createInitialWindows(data?.[0]?.deviceId || null)
    setActiveWindow(windows[0])
    setSmallWindows(windows.slice(1))
  }, [data])

  const handleWindowClick = (clickedWindow: WindowContent) => {
    if (!activeWindow) return

    // Find the current active window and the clicked window
    const newSmallWindows = smallWindows.map((window) => (window.id === clickedWindow.id ? activeWindow : window))

    setActiveWindow(clickedWindow)
    setSmallWindows(newSmallWindows)
  }

  const { data: cameraPermission } = useCameraPermission()
  const { data: microphonePermission } = useMicrophonePermission()

  const handleRequestPermission = async () => {
    const stream = await requestCameraAndMicrophoneStream()
    console.log(stream)
  }

  const WebCamList =
  isError ? <div>Error</div> :
  isLoading ? <div>Loading...</div> : (
    <div className="flex flex-wrap gap-4">
      {data?.map((webcam, index) => (
        <div key={webcam.deviceId} className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded">
          <span>{index + 1}</span>
          <span>{webcam.label}</span>
          <span>{webcam.kind}</span>
          <span>{webcam.deviceId}</span>
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Large Window */}
        <div className={`${activeWindow?.color} rounded-lg border-2 p-8 h-[500px] transition-all duration-300 ease-in-out`}>
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-800">{activeWindow?.title}</h1>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
            <div className="flex-1 bg-transparent p-2 flex items-center justify-center overflow-hidden">
              {activeWindow?.content}
            </div>
          </div>
        </div>

        {/* Small Windows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {smallWindows.map((window) => (
            <div
              key={window.id}
              onClick={() => handleWindowClick(window)}
              className={`${window.color} rounded-lg border-2 p-4 h-32 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95`}
            >
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-800">{window.title}</h3>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-red-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-sm p-2 shadow-inner flex items-center justify-center overflow-hidden">
                  {typeof window.content === 'string' ? (
                    <p className="text-xs text-gray-600 line-clamp-3">
                      {window.content}
                    </p>
                  ) : (
                    window.content
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="text-center text-gray-600 text-sm">
          Click on any of the smaller windows below to make it the main window
        </div>
        <div className="flex">
          Webcams:
          {WebCamList}
        </div>
        <div className="flex">
          Camera Permission:
          <p>{cameraPermission?.state}</p>
        </div>
        <div className="flex">
          Microphone Permission:
          <p>{microphonePermission?.state}</p>
        </div>
        <div className="flex">
          <button onClick={handleRequestPermission}>Request Permission</button>
        </div>
      </div>
    </div>
  )
}
