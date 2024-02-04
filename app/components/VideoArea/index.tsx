import { useRef } from "react"
import Webcam from "react-webcam"

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user"
}

export default function VideoArea() {
  const webcamRef = useRef<Webcam>(null)
  return (
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
  )
}