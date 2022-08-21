import LoginIcon from '@/icons/login'
import { Avatar, Tooltip } from '@nextui-org/react'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Nav() {
  const { data: session } = useSession()
  const isSignedIn = session?.user

  return (
    <nav className="flex h-full w-20 flex-col-reverse bg-zinc-800/20 p-4">
      <Tooltip
        content={isSignedIn ? 'Sign Out' : 'Sign In'}
        rounded
        hideArrow
        shadow
        placement="right"
        color="invert"
      >
        <Avatar
          squared
          zoomed
          size="lg"
          bordered
          color="gradient"
          className="hover:cursor-pointer"
          src={session?.user.image ?? '/favicon.png'}
          onClick={isSignedIn ? signOut : signIn}
        />
      </Tooltip>
    </nav>
  )
}
