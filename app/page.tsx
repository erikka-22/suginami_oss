"use client"

import VideoArea from "@/app/components/VideoArea"
import ShotButton from "@/app/components/ShotButton"
import BackgrountImageList from "@/app/components/BackgroundImageList"

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <VideoArea />
      <ShotButton />
      <BackgrountImageList />
    </main>
  );
}
