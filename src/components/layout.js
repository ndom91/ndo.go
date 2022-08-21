import * as Tooltip from '@radix-ui/react-tooltip'
import Nav from '@/components/nav'

export default function Layout({ children }) {
  return (
    <main className="flex">
      <Tooltip.Provider>
        <Nav />
        {children}
      </Tooltip.Provider>
    </main>
  )
}
