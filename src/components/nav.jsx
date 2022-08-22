import { Avatar, Dropdown } from '@nextui-org/react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Login, Logout } from '@/icons'

export default function Nav() {
  const { data: session } = useSession()
  const isSignedIn = session?.user

  const dropdownAction = (key) => {
    if (key === 'logout') {
      isSignedIn ? signOut() : signIn()
    }
  }

  return (
    <nav className="flex h-full w-20 flex-col-reverse bg-zinc-800/20 p-4">
      <Dropdown>
        <Dropdown.Trigger>
          <Avatar
            squared
            zoomed
            size="lg"
            bordered
            color="gradient"
            className="hover:cursor-pointer"
            src={session?.user.image ?? '/favicon.png'}
          />
        </Dropdown.Trigger>
        <Dropdown.Menu
          aria-label="User Actions"
          onAction={(key) => dropdownAction(key)}
        >
          <Dropdown.Item key="settings" icon={<Login />}>
            Settings
          </Dropdown.Item>
          <Dropdown.Item
            key="logout"
            icon={isSignedIn ? <Logout /> : <Login />}
          >
            {isSignedIn ? 'Sign Out' : 'Sign In'}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </nav>
  )
}
