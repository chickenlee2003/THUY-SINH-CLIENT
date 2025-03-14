"use client"

import { useState, useRef } from "react"
import { Camera, CameraIcon as FlipCamera, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CameraInterfaceProps {
  onCapture: (imageData: string) => void
  onClose: () => void
}

export function CameraInterface({ onCapture, onClose }: CameraInterfaceProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isStreamActive, setIsStreamActive] = useState(false)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsStreamActive(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setIsStreamActive(false)
    }
  }

  const switchCamera = () => {
    stopCamera()
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw the video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert to base64
        const imageData = canvas.toDataURL("image/jpeg")
        onCapture(imageData)
        stopCamera()
      }
    }
  }

  // Start camera when component mounts
  useState(() => {
    startCamera()
    return () => stopCamera()
  }, [facingMode])

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <Button variant="ghost" size="icon" className="text-white" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white" onClick={switchCamera}>
          <FlipCamera className="h-6 w-6" />
        </Button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={cn("absolute inset-0 h-full w-full object-cover", facingMode === "user" && "scale-x-[-1]")}
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Capture Grid Overlay */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="border border-white/20" />
          ))}
        </div>
      </div>

      {/* Capture Button */}
      <div className="p-8 flex justify-center">
        <Button
          size="lg"
          className="h-16 w-16 rounded-full bg-white hover:bg-gray-200"
          onClick={captureImage}
          disabled={!isStreamActive}
        >
          <Camera className="h-8 w-8 text-black" />
        </Button>
      </div>
    </div>
  )
}

