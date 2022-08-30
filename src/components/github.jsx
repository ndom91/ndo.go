import { useEffect, useState } from 'react'
import { Badge, Button, Row, Card, Text, Modal } from '@nextui-org/react'
import { signIn } from 'next-auth/react'
import { decodeHtml, timeAgo } from '../lib/helpers.js'
import { useSession } from 'next-auth/react'

export default function Github() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState([])
  const [comment, setComment] = useState([])
  const [openModal, setOpenModal] = useState(false)

  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        `https://api.github.com/notifications?${new URLSearchParams({
          participating: true,
        })}`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: 'application/vnd.github+json',
          },
        }
      )
      if (res.status === 200) {
        const data = await res.json()
        console.log('Github Data', data)
        setNotifications(data)
      } else {
        throw new Error('Failed to fetch')
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
      <Card.Header className="space-x-2">
        <img
          alt="GitHub Logo"
          src="/icons/github.svg"
          width="34px"
          height="34px"
        />
        <div className="text-xl font-thin dark:text-white">Github</div>
      </Card.Header>
      <Card.Body className="m-0 px-1 py-0">
        <ul>
          {notifications?.length > 0 && session?.user ? (
            notifications.map((notification) => (
              <li key={notification.id} className="m-0 p-0">
                <a
                  href={notification.url}
                  target="_blank"
                  rel="noopener noreferer noreferrer"
                  className="flex flex-col items-start justify-start rounded-md p-2 hover:cursor-pointer hover:bg-gray-800"
                >
                  <div className="flex justify-start">
                    <span className="text-lg font-extralight">
                      {notification.subject.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-start space-x-2">
                    <Badge
                      variant="flat"
                      color="primary"
                      className=""
                      disableOutline
                    >
                      {notification.reason}
                    </Badge>
                    {/* <span */}
                    {/*   className="text-sm" */}
                    {/*   onClick={(e) => openCommentModal(e, post)} */}
                    {/* > */}
                    {/*   {post.num_comments ?? 0} Comments */}
                    {/* </span> */}
                    <span className="text-sm font-extralight text-slate-400">
                      {timeAgo(notification.updated_at * 1000)}
                    </span>
                  </div>
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
