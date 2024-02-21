"use client";

import { useState } from "react";
import Image from "next/image";
import CameraPreviewStream from "./components/CameraPreviewStream";

export default function Page() {
  const [selectedImage, setSelectedImage] = useState("");
  const [isShooting, setIsShooting] = useState<boolean>(true);

  const handleDownload = () => {
    // TODO: Implement download image
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CameraPreviewStream
        backgroundName={selectedImage}
        isShooting={isShooting}
      />
      {isShooting ? (
        <>
          <button onClick={() => setIsShooting(false)}>撮影する</button>
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
        </>
      )}
    </main>
  );
}
