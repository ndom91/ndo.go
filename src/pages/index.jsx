import { useEffect, useState } from 'react'
import { Grid } from '@nextui-org/react'
import { AnimatePresence } from 'framer-motion'
import { unstable_getServerSession } from 'next-auth/next'

import { authOptions } from '@/api/auth/[...nextauth]'
import Layout from '@/components/layout'
import CommandMenu from '@/components/commandMenu'
import CommandWrapper from '@/components/commandWrapper'
import HackerNews from '@/components/hackernews'

export default function Home({ nextauth }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function listener(e) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey) && nextauth.user) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }

    function listenerEsc(e) {
      if (e.key === 'Escape' && open) {
        setOpen((o) => !o)
      }
    }

    document.addEventListener('keydown', listener)
    document.addEventListener('keydown', listenerEsc)

    return () => {
      document.removeEventListener('keydown', listener)
      document.removeEventListener('keydown', listenerEsc)
    }
  }, [open, nextauth])

  const logAndClose = () => {
    setOpen(!open)
  }

  return (
    <Layout>
      <AnimatePresence
        initial={false}
        exitBeforeEnter={true}
        onExitComplete={() => null}
      >
        {open && (
          <>
            <div
              onClick={logAndClose}
              className="fixed top-0 left-0 z-[9998] h-full w-full bg-black bg-opacity-50 transition duration-300 ease-in-out"
            >
              <CommandWrapper onClick={(e) => e.stopPropagation()}>
                <CommandMenu close={setOpen} />
              </CommandWrapper>
            </div>
          </>
        )}
      </AnimatePresence>
      <Grid.Container className="h-full p-6">
        <Grid justify="flex-start" alignItems="stretch" className="h-full">
          <HackerNews className="h-full" />
        </Grid>
      </Grid.Container>
    </Layout>
  )
}

export async function getServerSideProps({ req, res }) {
  const session = await unstable_getServerSession(req, res, authOptions)
  return {
    props: {
      session,
      nextauth: session,
    },
  }
}
