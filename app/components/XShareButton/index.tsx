export default function XShareButton({
  url
}: {
  url: string
}) {
  return (
    <div>
      <a 
        href="https://twitter.com/share?ref_src=twsrc%5Etfw" 
        className="twitter-share-button" 
        data-show-count="false"
        data-hashtags="スギナミウェブミュージアム"
        // data-url={url}
      >
        ポスト
      </a>
      <script 
        async src="https://platform.twitter.com/widgets.js" 
      ></script>
    </div>
  )
}