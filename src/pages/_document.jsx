import React from 'react'
import { Html, Head, Main, NextScript } from 'next/document'
import { CssBaseline } from '@nextui-org/react'

export default function Document() {
  return (
    <Html className="h-full w-full bg-gradient-to-br from-rose-100 via-pink-300 to-purple-400">
      <Head>
        <link href="/favicon.png" rel="icon" sizes="32x32" type="image/png" />
        {CssBaseline.flush()}
      </Head>
      <body className="h-full w-full bg-gradient-to-br from-rose-100 via-pink-300 to-purple-400">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
export async function getInitialProps(ctx) {
  const initialProps = await Document.getInitialProps(ctx)
  return {
    ...initialProps,
    styles: React.Children.toArray([initialProps.styles]),
  }
}
