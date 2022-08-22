import { Avatar } from '@nextui-org/react'

export default function Tag({ text }) {
  return (
    <span className="rounded-xl bg-indigo-200/50 px-2 py-1 text-xs font-bold text-indigo-900">
      {text}
    </span>
  )
}
