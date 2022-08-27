import { Container, Row, Col, Grid } from '@nextui-org/react'
import Layout from '@/components/layout'
import HackerNews from '@/components/hackernews'

export default function Home() {
  return (
    <Layout>
      <Grid.Container className="h-full p-6">
        <Grid justify="flex-start" alignItems="stretch" className="h-full">
          <HackerNews className="h-full" />
        </Grid>
      </Grid.Container>
    </Layout>
  )
}

export async function getStaticProps() {
  return {
    props: {},
  }
}
