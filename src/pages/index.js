/* import Head from 'next/head' */
/* import Image from 'next/image' */
import Layout from '@/components/layout'
import HackerNews from '@/components/hackernews'

export default function Home() {
  return (
    <Layout>
      <HackerNews />
    </Layout>
  )
}

export async function getStaticProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  }
}
