import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html className="h-full w-full bg-gradient-to-br from-rose-100 via-pink-300 to-purple-400">
      <Head>
        <link href="/favicon.png" rel="icon" sizes="32x32" type="image/png" />
      </Head>
      <body className="h-full w-full bg-gradient-to-br from-rose-100 via-pink-300 to-purple-400">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
