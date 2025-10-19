import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <script src="https://unpkg.com/html5-qrcode@2.3.9/minified/html5-qrcode.min.js"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
