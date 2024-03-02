import { Button } from "@chakra-ui/react";

export default function XShareButton() {
  const tweetText = "スギナミ・ウェブ・ミュージアムに行ってきました";
  const originalPageUrl = "https://www.suginamiart.tokyo/webmuseum/";
  const hashtags = "スギナミウェブミュージアム";
  return (
    <Button
      as="a"
      href={`https://twitter.com/share?ref_src=twsrc%5Etfw&text=${tweetText}&hashtags=${hashtags}&url=${originalPageUrl}`}
      target="_blank"
    >
      ポスト
    </Button>
  );
}
