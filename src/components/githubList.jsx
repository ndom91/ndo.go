import { useEffect, useState } from 'react'
import { Avatar, Loading, Card, Input } from '@nextui-org/react'
import { signIn } from 'next-auth/react'
import { decodeHtml, timeAgo } from '../lib/helpers.js'
import GithubCard from './githubCard'
import { useSession } from 'next-auth/react'

const wantedRepoOrgs = ['checkly']

export default function GithubList() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [notifications, setNotifications] = useState([])
  const [originalNotifications, setOriginalNotifications] = useState([])
  const [comment, setComment] = useState([])
  const [openModal, setOpenModal] = useState(false)

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

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `https://api.github.com/notifications?${new URLSearchParams({
          all: false,
          participating: true,
          per_page: 50,
        })}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_PAT}`,
            Accept: 'application/vnd.github+json',
          },
        }
      )

      if (res.status === 200) {
        const data = await res.json()

        const githubNotifications = data
          .filter((data) => {
            // Don't include notifications about my own commits to my own PRs
            return !(
              data.reason === 'author' &&
              data.repository?.owner?.login === 'ndom91'
            )
          })
          .sort((a, b) => a.updated_at > b.updated_at)

        setNotifications(githubNotifications)
        setOriginalNotifications(data)
      } else {
        throw new Error('Failed to fetch')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    session?.user && fetchNotifications()
  }, [session?.user])

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
        {session?.user ? (
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
          {notifications?.length > 0 && session?.user ? (
            notifications.map((notification) => (
              <GithubCard notification={notification} key={notification.id} />
            ))
          ) : !session?.user ? (
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
