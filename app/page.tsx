"use client";

import { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import CameraPreviewStream from "./components/CameraPreviewStream";
import { useRouter } from "next/router";

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user",
};

export default function Page() {
  // const webcamRef = useRef<Webcam>(null);
  // const [url, setUrl] = useState<string | null>(null);
  // const router = useRouter();
  const [selectedImage, setSelectedImage] = useState("");
  const [isShooting, setIsShooting] = useState<boolean>(true);

  const selectImage = (filename: string) => {
    setSelectedImage(filename);
    console.log("selectedImage", selectedImage);
  };

  const startShooting = () => {
    setIsShooting(true);
    // createVideoStream();
  };

  const stopShooting = () => {
    setIsShooting(false);
    // removeVideoStream();
  };

  // const handleClick = useCallback(
  //   (path: string) => {
  //     const imageSrc = webcamRef.current?.getScreenshot();
  //     if (imageSrc) {
  //       localStorage.setItem("photoUrl", imageSrc);
  //       router.push(path);
  //     }
  //   },
  //   [webcamRef, router]
  // );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CameraPreviewStream backgroundName={selectedImage} />
      {/* {isShooting ? (
        <>
          <button onClick={stopShooting}>撮影する</button>
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
        </>
      ) : (
        <>
          <button onClick={startShooting}>カメラに戻る</button>
        </>
      )} */}
    </main>
  );
}
