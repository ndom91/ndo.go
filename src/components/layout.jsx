import Nav from '@/components/nav'

export default function Layout({ children }) {
  return (
    <main className="flex h-screen w-screen">
      <Nav />
      {children}
    </main>
  )
}
