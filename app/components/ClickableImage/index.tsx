import { Image } from "@chakra-ui/react";

interface ClickableImageProps {
  src: string;
  alt: string;
  onClick: (src: string) => void;
  isSelected: boolean;
}

export default function ClickableImage({
  src,
  alt,
  onClick,
  isSelected,
}: ClickableImageProps) {
  return (
    <Image
      src={src}
      width={135}
      height={90}
      alt={alt}
      onClick={() => onClick(src)}
      _hover={{
        cursor: "pointer",
        filter: "brightness(90%)",
      }}
      border={isSelected ? "4px solid green" : "none"}
    />
  );
}
