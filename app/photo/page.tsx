"use client"

import Image from "next/image";

export default function Page() {
  let photoUrl = localStorage.getItem("photoUrl")
  if (photoUrl === null) {
    photoUrl = ""
  }
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
