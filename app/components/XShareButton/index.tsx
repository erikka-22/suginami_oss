export default function XShareButton() {
  return (
    <div>
      <a 
        href="https://twitter.com/share?ref_src=twsrc%5Etfw" 
        className="twitter-share-button" 
        data-show-count="false"
      >
        ポスト
      </a>
      <script 
        async src="https://platform.twitter.com/widgets.js" 
      ></script>
    </div>
  )
}