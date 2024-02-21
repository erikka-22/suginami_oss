"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import CameraPreviewStream from "./components/CameraPreviewStream";
import XShareButton from "./components/XShareButton";

export default function Page() {
  const [selectedImage, setSelectedImage] = useState("");
  const [isShooting, setIsShooting] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasRefUrl, setCanvasRefUrl] = useState<string>("");

  const handleShooting = () => {
    setIsShooting(false)
    if (canvasRef == null || canvasRef.current == null) return false;
    setCanvasRefUrl(canvasRef.current.toDataURL("image/png"))
    console.log(canvasRefUrl)
  }

  const handleDownload = () => {
    if (canvasRef == null || canvasRef.current == null) return false;
    const link = document.createElement("a");
    link.download = "image.png";
    link.href = canvasRefUrl;
    link.click();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CameraPreviewStream
        backgroundName={selectedImage}
        isShooting={isShooting}
        canvasRef={canvasRef}
      />
      {isShooting ? (
        <>
          <button onClick={() => handleShooting()}>撮影する</button>
          <p>背景画像</p>
          <p>選択した画像：{selectedImage}</p>
          <div className="flex flex-row justify-between">
            <button onClick={() => setSelectedImage("1812.jpg")}>
              <Image
                src="/images/1812.jpg"
                width={270}
                height={180}
                alt="背景画像"
              />
            </button>
            <button onClick={() => setSelectedImage("9790.jpg")}>
              <Image
                src="/images/9790.jpg"
                width={270}
                height={180}
                alt="背景画像"
              />
            </button>
            <button onClick={() => setSelectedImage("9792.jpg")}>
              <Image
                src="/images/9792.jpg"
                width={270}
                height={180}
                alt="背景画像"
              />
            </button>
            {/* <button onClick={() => setSelectedImage("9793.jpg")}>
              <Image
                src="/images/9793.jpg"
                width={270}
                height={180}
                alt="背景画像"
              />
            </button> */}
          </div>
        </>
      ) : (
        <>
          <button onClick={() => setIsShooting(true)}>カメラに戻る</button>
          <button onClick={handleDownload}>ダウンロード</button>
          <XShareButton 
            url={canvasRefUrl}
          />
        </>
      )}
    </main>
  );
}
