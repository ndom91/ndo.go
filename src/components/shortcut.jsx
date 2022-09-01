import { useEffect, useState } from 'react'
import { Badge, Button, Row, Card, Text, Modal, Input } from '@nextui-org/react'
import { signIn } from 'next-auth/react'
import { decodeHtml, timeAgo } from '../lib/helpers.js'
import { useSession } from 'next-auth/react'

const SHORCUT_USER_ID = '600168ef-5cec-450b-90ba-4a497a949263'

export default function Shortcut() {
  const { data: session } = useSession()
  const [filter, setFilter] = useState('')
  const [stories, setStories] = useState([])
  const [epics, setEpics] = useState([])
  const [originalStories, setOriginalStories] = useState([])
  const [comment, setComment] = useState([])
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    if (!filter && stories !== originalStories) setStories(originalStories)

    const filteredStories = originalStories.filter((story) => {
      if (story.name.includes(filter)) {
        return story
      } else if (story.id.toString().includes(filter)) {
        return story
      }
    })
    setStories(filteredStories)
  }, [filter])

  const fetchNotifications = async () => {
    try {
      const epicRes = await fetch('https://api.app.shortcut.com/api/v3/epics', {
        headers: {
          'Shortcut-Token': process.env.NEXT_PUBLIC_SHORTCUT_KEY,
          'Content-Type': 'application/json',
        },
      })
      const epicData = await epicRes.json()
      const teamEpics = epicData.filter((epic) => {
        return epic.owner_ids.includes(SHORCUT_USER_ID)
      })
      setEpics(teamEpics)

      const res = await fetch(
        `https://api.app.shortcut.com/api/v3/search/stories?${new URLSearchParams(
          {
            query: 'owner:ndom91 !state:"Complete" !is:archived',
          }
        )}`,
        {
          headers: {
            'Shortcut-Token': process.env.NEXT_PUBLIC_SHORTCUT_KEY,
            'Content-Type': 'application/json',
          },
        }
      )

      if (res.status === 200) {
        const data = await res.json()
        console.log('Shortcut Data', data.data)
        /* const workNotifications = data.filter((not) => { */
        /*   return wantedRepoOrgs.includes(not.repository?.owner?.login) */
        /* }) */
        /* console.log('Github Data', workNotifications) */
        setStories(data.data)
        setOriginalStories(data.data)
      } else {
        throw new Error('Failed to fetch')
      }
    } catch (e) {
      console.error(e)
    }
  }

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

  const fetchComments = async (post) => {
    try {
      const res = await fetch(
        `http://hn.algolia.com/api/v1/search?tags=comment,story_${post.objectID}`
      )
      if (res.status === 200) {
        const data = await res.json()
        console.log('comment data', data)
        setComment({ ...comment, title: post.title, items: data.hits })
      } else {
        throw new Error('Failed to fetch')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const openCommentModal = (e, post) => {
    e.preventDefault()
    fetchComments(post)
    setOpenModal(!openModal)
  }

  const closeHandler = () => {
    setOpenModal(false)
    setComment({ ...comment, items: [] })
  }

  useEffect(() => {
    session?.user && fetchNotifications()
  }, [session?.user])

  return (
    <Card
      css={{ p: '$6' }}
      className="max-h-full flex-shrink-0 border-0 bg-gray-900/95 shadow-2xl"
      variant="shadow"
    >
      <Card.Header className="flex justify-between space-x-2 py-6">
        <div className="flex items-center justify-start gap-2">
          <img
            alt="GitHub Logo"
            src="/icons/shortcut.svg"
            width="34px"
            height="34px"
          />
          <div className="text-xl font-thin dark:text-white">Shortcut</div>
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
          {stories?.length > 0 && session?.user ? (
            stories.map((story) => (
              <li key={story.id} className="m-0 p-0">
                <a
                  href={story.app_url}
                  target="_blank"
                  rel="noopener noreferer noreferrer"
                  className="flex flex-col items-start justify-start rounded-md p-2 hover:cursor-pointer hover:bg-gray-800"
                >
                  <span className="flex w-full items-center justify-start gap-2 text-lg font-extralight">
                    <Badge
                      variant="flat"
                      color="secondary"
                      size="md"
                      disableOutline
                      className="w-14"
                    >
                      {story.id}
                    </Badge>
                    <div className="flex flex-grow flex-col items-start justify-center">
                      <span className="">{story.name}</span>
                      {story.epic_id ? (
                        <span className="text-sm text-slate-400">
                          {epics.find((epic) => epic.id === story.epic_id).name}
                        </span>
                      ) : null}
                    </div>
                    <Badge
                      variant="flat"
                      color="primary"
                      size="sm"
                      disableOutline
                    >
                      {story.story_type}
                    </Badge>
                  </span>
                  {/* <div className="flex items-center justify-start space-x-2"> */}
                  {/* <span */}
                  {/*   className="text-sm" */}
                  {/*   onClick={(e) => openCommentModal(e, post)} */}
                  {/* > */}
                  {/*   {post.num_comments ?? 0} Comments */}
                  {/* </span> */}
                  {/*   <span className="text-sm font-extralight text-slate-400"> */}
                  {/*     {timeAgo(notification.updated_at * 1000)} */}
                  {/*   </span> */}
                  {/* </div> */}
                </a>
              </li>
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
          ) : (
            <div className="my-4 flex w-full justify-center">
              <Badge variant="points" />
            </div>
          )}
        </ul>
      </Card.Body>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        width="40rem"
        open={openModal}
        onClose={closeHandler}
      >
        <Modal.Header className="flex justify-start">
          <Text b className="text-left text-xl font-light">
            {comment.title}
          </Text>
        </Modal.Header>
        <Modal.Body className="overflow-y-scroll">
          {comment.items?.length > 0 ? (
            comment.items?.map((c) => (
              <Row
                key={c.objectID}
                justify="space-between"
                className="flex-col rounded-md border-2 border-gray-200 p-2"
              >
                <Text
                  size={14}
                  className="break-word text-ellipsis whitespace-pre-wrap "
                  dangerouslySetInnerHTML={{
                    __html: decodeHtml(c.comment_text),
                  }}
                />
                <Text className="pt-2 text-sm font-light">
                  <Badge
                    isSquared
                    variant="bordered"
                    color="primary"
                    className="mr-2"
                  >
                    {c.author}
                  </Badge>
                  {timeAgo(c.created_at_i * 1000)}
                </Text>
              </Row>
            ))
          ) : (
            <div className="my-4 flex w-full justify-center">
              <Badge variant="points" />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={closeHandler}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  )
}
