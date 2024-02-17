"use client"

import { useRef, useCallback, useState } from "react"
import Webcam from "react-webcam"
import { useRouter } from "next/navigation"
import Image from "next/image";

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user"
}

export default function Page() {
  const router = useRouter()
  const webcamRef = useRef<Webcam>(null)
  const [selectedImage, setSelectedImage] = useState('')

  const selectImage = (filename: string) => {
    setSelectedImage(filename)
  }

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
      <button onClick={(e) => handleClick("/photo")}>撮影する</button>
      <p>背景画像</p>
      <p>選択した画像：{selectedImage}</p>
      <button onClick={(e) => selectImage("1812.jpg")}>
        <Image 
          src="/images/1812.jpg"
          width={270} 
          height={180}
          alt="背景画像"
        />
      </button>
      <button onClick={(e) => selectImage("9790.jpg")}>
        <Image 
          src="/images/9790.jpg"
          width={270} 
          height={180}
          alt="背景画像"
        />
      </button>
      <button onClick={(e) => selectImage("9792.jpg")}>
        <Image 
          src="/images/9792.jpg"
          width={270} 
          height={180}
          alt="背景画像"
        />
      </button>
      <button onClick={(e) => selectImage("9793.jpg")}>
        <Image 
          src="/images/9793.jpg"
          width={270} 
          height={180}
          alt="背景画像"
        />
      </button>
    </main>
  );
}
