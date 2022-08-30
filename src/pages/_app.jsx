import { SessionProvider } from 'next-auth/react'
import { createTheme, NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import '../styles/globals.css'
import '../components/CommandMenu.css'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const lightTheme = createTheme({
    type: 'light',
    theme: {},
  })

  const darkTheme = createTheme({
    type: 'dark',
    theme: {
      colors: {
        backgroundContrast: '#f9fafb',
        gray50: '#f9fafb',
        gray100: '#f3f4f6',
        gray200: '#e5e7eb',
        gray300: '#d1d5db',
        gray400: '#9ca3af',
        gray500: '#6b7280',
        gray600: '#4b5563',
        gray700: '#374151',
        gray800: '#1f2937',
        gray900: '#111827',
        primary: '$yellow500',
        primaryShadow: '$yellow500',
      },
    },
  })

  return (
    <SessionProvider session={session}>
      <NextThemesProvider
        enableColorScheme
        defaultTheme="dark"
        attribute="class"
        value={{
          light: lightTheme.className,
          dark: darkTheme.className,
        }}
      >
        <NextUIProvider defaultTheme="dark">
          <Component {...pageProps} />
        </NextUIProvider>
      </NextThemesProvider>
    </SessionProvider>
  )
}
