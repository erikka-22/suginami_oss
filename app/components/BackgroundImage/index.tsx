import Image from 'next/image'

type Props = {
  imageUrl: string
}

export default function BackgroundImage() {
  return (
    <div>
      <button>
        <Image 
          src="/next.svg"
          width={500}
          height={500}
          alt='background image'
        />
      </button>
    </div>
  )
}