import { Badge, Text } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import { timeAgo } from '@/lib/helpers.js'

export default function GithuCard({ notification }) {
  const { data: session } = useSession()

  const markAsRead = async (threadId) => {
    try {
      const res = await fetch(
        `https://api.github.com/notifications/threads/${threadId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: 'application/vnd.github+json',
          },
        }
      )
      if (res.status === 205) {
        // toast.success('Marked as read')
        console.log('Marked as read', threadId)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <li key={notification.id} className="m-0 p-0">
      <a
        href={notification.subject?.url
          ?.replace('api.github.com/repos', 'github.com')
          .replace('pulls', 'pull')}
        target="_blank"
        rel="noopener noreferer noreferrer"
        className="flex flex-col items-start justify-start rounded-md p-2 hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800"
      >
        <span className="flex w-full items-center justify-start gap-2 text-lg font-extralight">
          <div className="flex flex-col items-start justify-center">
            <span className="flex-grow">{notification.subject?.title}</span>
            <div className="flex items-center justify-start space-x-2">
              <Badge variant="flat" color="primary" size="sm" disableOutline>
                {notification.repository?.owner?.login}
              </Badge>
              <Badge variant="flat" color="secondary" size="sm" disableOutline>
                {notification.reason}
              </Badge>
              <div className="text-sm font-extralight text-slate-400">
                {timeAgo(notification.updated_at)}
              </div>
            </div>
          </div>
        </span>
      </a>
    </li>
  )
}
