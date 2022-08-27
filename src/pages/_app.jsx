import { SessionProvider } from 'next-auth/react'
import { NextUIProvider } from '@nextui-org/react'
import '../styles/globals.css'
import '../components/CommandMenu.css'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>
    </SessionProvider>
  )
}
