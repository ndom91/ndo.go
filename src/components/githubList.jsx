import { useCallback, useEffect, useState } from 'react'
import { Avatar, Loading, Card, Input } from '@nextui-org/react'
import { signIn } from 'next-auth/react'
import GithubCard from '@/components/githubCard'

export default function GithubList({ email }) {
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [notifications, setNotifications] = useState([])
  const [originalNotifications, setOriginalNotifications] = useState([])

  useEffect(() => {
    if (!filter && notifications !== originalNotifications)
      setNotifications(originalNotifications)

    const filteredNotifications = originalNotifications.filter((notif) => {
      if (notif.repository.owner.login.includes(filter)) {
        return notif
      } else if (notif.subject.title.includes(filter)) {
        return notif
      }
    })
    setNotifications(filteredNotifications)
  }, [filter])

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const githubRes = await fetch(
        `/api/github?email=${encodeURIComponent(email)}`
      )
      const githubData = await githubRes.json()
      setNotifications(githubData.notifications)
      setOriginalNotifications(githubData.notifications)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [email])

  useEffect(() => {
    email && fetchNotifications()
  }, [email, fetchNotifications])

  return (
    <Card
      css={{ p: '$6' }}
      className="max-h-full flex-shrink-0 border-0 shadow-2xl dark:bg-gray-900/95"
      variant="shadow"
    >
      <Card.Header className="flex justify-between space-x-2 py-6">
        <div className="flex items-center justify-start gap-2">
          <Avatar
            squared
            alt="GitHub Logo"
            src="/icons/github2.svg"
            className="github-avatar"
            width="34px"
            height="34px"
          />
          <div className="text-xl font-thin dark:text-white">Github</div>
        </div>
        {email ? (
          <Input
            bordered
            color="secondary"
            style={{ '--nextui--inputTextColor': '#9750dd' }}
            borderWeight="light"
            labelPlaceholder="Search"
            contentClickable
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        ) : null}
      </Card.Header>
      <Card.Body className="m-0 px-1 py-0">
        <ul className="flex flex-col gap-2">
          {notifications?.length > 0 && email ? (
            notifications.map((notification) => (
              <GithubCard notification={notification} key={notification.id} />
            ))
          ) : !email ? (
            <div className="flex w-full justify-center">
              <span className="text-lg font-extralight">
                Please{' '}
                <span
                  className="underline-offset-[0.5] underline decoration-pink-500/60 decoration-4 hover:cursor-pointer"
                  onClick={() => signIn('github')}
                >
                  Login
                </span>{' '}
                to continue
              </span>
            </div>
          ) : loading ? (
            <div className="my-4 flex w-full justify-center">
              <Loading type="points-opacity" />
            </div>
          ) : (
            <div className="my-4 flex w-full justify-center">No Results</div>
          )}
        </ul>
      </Card.Body>
    </Card>
  )
}
