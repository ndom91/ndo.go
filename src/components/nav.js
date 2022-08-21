import * as Avatar from '@radix-ui/react-avatar'
import * as Tooltip from '@radix-ui/react-tooltip'
import LoginIcon from '@/icons/login'

export default function Nav() {
  return (
    <nav className="flex h-full w-96 flex-col-reverse">
      <button className="">
        <Tooltip.Root>
          <Tooltip.Trigger>
            <LoginIcon />
          </Tooltip.Trigger>

          <Tooltip.Content side="top">
            Login
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip.Root>
      </button>
    </nav>
  )
}
