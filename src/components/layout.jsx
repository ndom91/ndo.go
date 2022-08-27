import { Container, Row, Col, Grid } from '@nextui-org/react'
import Nav from '@/components/nav'

export default function Layout({ children }) {
  return (
    <Container
      fluid
      responsive={false}
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
    >
      <Row>
        <Nav />
      </Row>
      <Row className="!h-[calc(100vh-88px)]">{children}</Row>
    </Container>
  )
}
