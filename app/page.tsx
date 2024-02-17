"use client"

import { useRef, useCallback, useState } from "react"
import Webcam from "react-webcam"
import { useRouter } from "next/navigation"

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user"
}

// import VideoArea from "@/app/components/VideoArea"
// import ShotButton from "@/app/components/ShotButton"
// import BackgrountImageList from "@/app/components/BackgroundImageList"

export default function Page() {
  const router = useRouter()
  const webcamRef = useRef<Webcam>(null)
  // const [url, setUrl] = useState<string | null>(null)
  const handleDownload = (url: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = 'capture.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleClick = useCallback((path: string) => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      // setUrl(imageSrc)
      localStorage.setItem('photoUrl', imageSrc)
      router.push(path)
    }
  }, [webcamRef, router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <Webcam 
          audio={false}
          width={540}
          height={360}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
        />
      </div>
      <a onClick={(e) => handleClick('/photo')}>撮影する</a>
    </main>
  );
}
