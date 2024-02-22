import { useEffect, useRef } from "react";
import {
  FilesetResolver,
  ImageSegmenter,
  ImageSegmenterResult,
} from "@mediapipe/tasks-vision";

interface CameraPreviewStreamProps {
  backgroundName: string;
  isShooting: boolean;
  canvasRef: any;
}

export default function CameraPreviewStream({
  backgroundName,
  isShooting,
  canvasRef,
}: CameraPreviewStreamProps) {
  let canvas: HTMLCanvasElement;
  let video: HTMLVideoElement;
  let canvasCtx: any;
  let imageSegmenter: ImageSegmenter;
  let backgroundImg: HTMLImageElement;
  let cameraTime: number;
  const videoRef = useRef<HTMLVideoElement>(null);

  const isCanvasValid = () => {
    if (canvasRef == null || canvasRef.current == null) return false;
    canvas = canvasRef.current;
    canvasCtx = canvas.getContext("2d");
    return true;
  };

  const createImageSegmenter = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2/wasm"
    );

    imageSegmenter = await ImageSegmenter.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      outputCategoryMask: true,
      outputConfidenceMasks: false,
    });
  };

  const createVideoStream = async () => {
    if (videoRef == null) return;
    video = videoRef.current as any;

    video.srcObject = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    video.addEventListener("loadeddata", canvasCallback);
  };

  const removeVideoStream = () => {
    if (video) {
      const stream = video.srcObject as MediaStream;
      const tracks = stream?.getTracks();
      if (tracks) {
        tracks.forEach((track) => track.stop());
      }
      video.srcObject = null;
    }
  };

  useEffect(() => {
    backgroundImg = new Image();
    if (backgroundName !== "") backgroundImg.src = backgroundName;
    createImageSegmenter();

    if (isShooting) {
      createVideoStream();
    } else {
      removeVideoStream();
    }

    return () => {
      removeVideoStream();
    };
  }, [backgroundName, createVideoStream, isShooting]);

  const videoCallback = (result: ImageSegmenterResult) => {
    if (!isCanvasValid()) return;

    // Get current camear data
    const imageData = canvasCtx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    ).data;
    // Draw background if the background selection exist
    if (backgroundImg !== undefined && backgroundImg.src) {
      canvasCtx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    }
    const backgroundData = canvasCtx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    ).data;

    const maskResult = result.categoryMask as any;
    const mask: number[] = maskResult.getAsFloat32Array();
    // // Make mask border smooth
    // for (let i = 0; i < 2; i++) {
    //   for (let j = 0; j < mask.length; j++) {
    //     if (j + 1 < mask.length) mask[j] = (mask[j] + mask[j + 1]) / 2;
    //   }
    // }

    let j = 0;
    for (let i = 0; i < mask.length; ++i) {
      let maskVal = mask[i];
      if (maskVal == 1) maskVal = 0.98;

      imageData[j] = backgroundData[j] * maskVal + imageData[j] * (1 - maskVal);
      imageData[j + 1] =
        backgroundData[j + 1] * maskVal + imageData[j + 1] * (1 - maskVal);
      imageData[j + 2] =
        backgroundData[j + 2] * maskVal + imageData[j + 2] * (1 - maskVal);
      imageData[j + 3] =
        backgroundData[j + 3] * maskVal + imageData[j + 3] * (1 - maskVal);

      j += 4;
    }
    // Draw segmented result
    const uint8Array = new Uint8ClampedArray(imageData.buffer);
    const dataNew = new ImageData(uint8Array, canvas.width, canvas.height);
    canvasCtx.putImageData(dataNew, 0, 0);

    window.requestAnimationFrame(canvasCallback);
  };

  const canvasCallback = async () => {
    if (!isCanvasValid()) return;

    // execute callback
    if (video.currentTime === cameraTime) {
      window.requestAnimationFrame(canvasCallback);
    } else {
      cameraTime = video.currentTime;

      // Draw camera
      canvasCtx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      if (imageSegmenter !== undefined && imageSegmenter !== null) {
        const startTimeMs = performance.now();
        // Call videoCallback
        imageSegmenter.segmentForVideo(video, startTimeMs, videoCallback);
      }
    }
  };

  return (
    <>
      <video autoPlay={true} ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} width="640px" height="480px" />
    </>
  );
}
