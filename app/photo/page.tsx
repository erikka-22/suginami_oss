"use client"

import Image from "next/image";
import { useState, useEffect } from "react"

export default function Page() {
  const [photoUrl, setPhotoUrl] = useState('')
  
  const getPhotoUrl = () => localStorage.getItem("photoUrl") || ""

  useEffect(() => {
    setPhotoUrl(getPhotoUrl())
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Image 
        src={photoUrl}
        width={540} 
        height={360}
        alt=""
      />
    </main>
  );
}
