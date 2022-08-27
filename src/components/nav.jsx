import { Avatar, Navbar, Dropdown, Text } from '@nextui-org/react'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Nav() {
  const { data: session } = useSession()

  const dropdownAction = (key) => {
    switch (key) {
      case 'logout':
        signOut()
        break
      case 'login':
        signIn('github')
        break
      default:
        console.log('Dropdown onClick', key)
    }
  }

  return (
    <Navbar
      isBordered={false}
      maxWidth="fluid"
      variant={'floating'}
      className="bg-none"
    >
      <Navbar.Brand>
        <Avatar
          squared
          size="lg"
          src="/favicon.png"
          alt="ndo logo"
          width="32"
          height="32"
        />
      </Navbar.Brand>
      <Navbar.Content
        css={{
          '@xs': {
            w: '12%',
            jc: 'flex-end',
          },
        }}
      >
        <Dropdown placement="bottom-right">
          <Navbar.Item>
            <Dropdown.Trigger>
              <Avatar
                bordered
                size="lg"
                squared
                zoomed
                as="button"
                color="gradient"
                src={session?.user.image ?? '/favicon.png'}
              />
            </Dropdown.Trigger>
          </Navbar.Item>
          <Dropdown.Menu
            aria-label="User menu actions"
            color="secondary"
            disabledKeys={['profile']}
            onAction={(key) => dropdownAction(key)}
          >
            <Dropdown.Item key="profile" css={{ height: '$18' }}>
              <Text color="inherit" css={{ d: 'flex' }}>
                Signed in as
              </Text>
              <Text b color="inherit" css={{ d: 'flex' }}>
                {session?.user.name}
              </Text>
            </Dropdown.Item>
            <Dropdown.Item key="settings" withDivider textValue="My Settings">
              My Settings
            </Dropdown.Item>
            <Dropdown.Item key="system" textValue="System">
              System
            </Dropdown.Item>
            {session?.user ? (
              <Dropdown.Item
                key="logout"
                withDivider
                color="error"
                textValue="Logout"
              >
                Log Out
              </Dropdown.Item>
            ) : (
              <Dropdown.Item
                key="login"
                withDivider
                color="secondary"
                textValue="Login"
              >
                Login
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </Navbar.Content>
    </Navbar>
  )
}
