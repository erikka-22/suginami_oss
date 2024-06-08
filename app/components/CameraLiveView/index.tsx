import { useEffect, useRef } from "react";
import {
  FilesetResolver,
  ImageSegmenter,
  ImageSegmenterResult,
} from "@mediapipe/tasks-vision";

const initializeImageSegmenter = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2/wasm"
  );

  return await ImageSegmenter.createFromOptions(vision, {
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

interface CameraLiveViewProps {
  backgroundImagePath: string;
  isCapturing: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const useImageSegmenter = () => {
  const imageSegmenterRef = useRef<ImageSegmenter | null>(null);

  useEffect(() => {
    const setupSegmenter = async () => {
      const segmenter = await initializeImageSegmenter();
      imageSegmenterRef.current = segmenter;
    };
    setupSegmenter();
  }, []);

  return imageSegmenterRef;
};

const useLiveView = (
  videoRef: React.RefObject<HTMLVideoElement>,
  isCapturing: boolean
) => {
  useEffect(() => {
    const initializeLiveView = async () => {
      const video = videoRef.current;
      if (video) {
        video.srcObject = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        video.play();
      }
    };

    const terminateLiveView = () => {
      const video = videoRef.current;
      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        video.srcObject = null;
      }
    };

    if (isCapturing) {
      initializeLiveView();
    } else {
      terminateLiveView();
    }

    return () => {
      terminateLiveView();
    };
  }, [videoRef, isCapturing]);
};

const drawSegmentedFrame = (
  canvas: HTMLCanvasElement,
  result: ImageSegmenterResult,
  backgroundImage: HTMLImageElement
) => {
  const canvasContext = canvas.getContext("2d") as CanvasRenderingContext2D;
  const imageData = canvasContext.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  ).data;

  if (backgroundImage.complete && backgroundImage.naturalWidth !== 0) {
    canvasContext.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  }
  const backgroundImageData = canvasContext.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  ).data;

  const maskResult = result.categoryMask as any;
  const mask: number[] = maskResult.getAsFloat32Array();

  let j = 0;
  for (let i = 0; i < mask.length; ++i) {
    let maskValue = mask[i];

    imageData[j] =
      backgroundImageData[j] * maskValue + imageData[j] * (1 - maskValue);
    imageData[j + 1] =
      backgroundImageData[j + 1] * maskValue +
      imageData[j + 1] * (1 - maskValue);
    imageData[j + 2] =
      backgroundImageData[j + 2] * maskValue +
      imageData[j + 2] * (1 - maskValue);
    imageData[j + 3] =
      backgroundImageData[j + 3] * maskValue +
      imageData[j + 3] * (1 - maskValue);

    j += 4;
  }

  const uint8Array = new Uint8ClampedArray(imageData.buffer);
  const newImageData = new ImageData(uint8Array, canvas.width, canvas.height);
  canvasContext.putImageData(newImageData, 0, 0);
};

const useCanvasUpdater = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  videoRef: React.RefObject<HTMLVideoElement>,
  imageSegmenterRef: React.RefObject<ImageSegmenter | null>,
  backgroundImagePath: string
) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const backgroundImage = new Image();
    let previousVideoTime = 0;

    backgroundImage.src = backgroundImagePath;

    const onCanvasUpdate = async () => {
      if (!canvas || !video) return;

      const canvasContext = canvas.getContext("2d") as CanvasRenderingContext2D;

      if (video.currentTime !== previousVideoTime) {
        previousVideoTime = video.currentTime;

        canvasContext.drawImage(
          video,
          0,
          0,
          video.videoWidth,
          video.videoHeight
        );

        if (imageSegmenterRef.current !== null) {
          const startTimeMs = performance.now();
          imageSegmenterRef.current.segmentForVideo(
            video,
            startTimeMs,
            (result: ImageSegmenterResult) =>
              drawSegmentedFrame(canvas, result, backgroundImage)
          );
        }
      }
      window.requestAnimationFrame(onCanvasUpdate);
    };

    backgroundImage.onload = () => {
      onCanvasUpdate();
    };

    if (backgroundImage.complete) {
      onCanvasUpdate();
    }

    video?.addEventListener("loadeddata", onCanvasUpdate);

    return () => {
      video?.removeEventListener("loadeddata", onCanvasUpdate);
    };
  }, [canvasRef, videoRef, imageSegmenterRef, backgroundImagePath]);
};

export default function CameraLiveView({
  backgroundImagePath,
  isCapturing,
  canvasRef,
}: CameraLiveViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageSegmenterRef = useImageSegmenter();
  useLiveView(videoRef, isCapturing);
  useCanvasUpdater(canvasRef, videoRef, imageSegmenterRef, backgroundImagePath);

  return (
    <>
      <video autoPlay={true} ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} width="640px" height="480px" />
    </>
  );
}
