import { useEffect, useState } from 'react'
import { Badge, Card, Grid, Text, Link } from '@nextui-org/react'
import { timeAgo } from '../lib/helpers.js'

/**
 * Algolia HN API: https://hn.algolia.com/api
 */
export default function HackerNews() {
  const [posts, setPosts] = useState([])
  const [openModal, setOpenModal] = useState(false)

  const fetchFrontPage = async () => {
    try {
      const res = await fetch(
        'https://hn.algolia.com/api/v1/search?tags=front_page'
      )
      if (res.status === 200) {
        const data = await res.json()
        console.log('HN Data', data.hits)
        setPosts(data.hits)
      } else {
        throw new Error('Failed to fetch')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchComments = async (storyId) => {
    try {
      const res = await fetch(
        `http://hn.algolia.com/api/v1/search?tags=comment,${storyId}`
      )
      if (res.status === 200) {
        const data = await res.json()
        console.log('comment data', data)
      } else {
        throw new Error('Failed to fetch')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const openCommentModal = () => {
    fetchComments()
    setOpenModal(!openModal)
  }

  useEffect(() => {
    fetchFrontPage()
  }, [])

  return (
    <Card css={{ p: '$6' }} className="max-h-full max-w-xl flex-shrink-0">
      <Card.Header>
        <img
          alt="HackerNews logo"
          src="https://news.ycombinator.com/y18.gif"
          width="34px"
          height="34px"
        />
        <Grid.Container css={{ pl: '$6' }}>
          <Grid xs={12}>
            <Text className="text-xl font-thin">HackerNews</Text>
          </Grid>
        </Grid.Container>
      </Card.Header>
      <Card.Body className="m-0 px-1 py-0">
        <ul>
          {posts.length > 0 ? (
            posts.map((post) => (
              <li key={post.objectID} className="m-0 p-0">
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferer noreferrer"
                  className="flex flex-col items-start justify-start rounded-md p-2 hover:cursor-pointer hover:bg-purple-50"
                >
                  <div className="flex justify-start">
                    <span className="text-lg font-extralight">
                      {post.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-start space-x-2">
                    <Badge variant="flat" color="primary" className="">
                      {post.points}
                    </Badge>
                    <span className="text-sm" onClick={openCommentModal}>
                      {post.num_comments ?? 0} Comments
                    </span>
                    <span className="text-sm font-extralight text-slate-400">
                      {timeAgo(post.created_at_i * 1000)}
                    </span>
                  </div>
                </a>
              </li>
            ))
          ) : (
            <Badge variant="dot" />
          )}
        </ul>
      </Card.Body>
      {/* <Card.Footer> */}
      {/*   <Link */}
      {/*     icon */}
      {/*     color="primary" */}
      {/*     target="_blank" */}
      {/*     href="https://github.com/nextui-org/nextui" */}
      {/*   > */}
      {/*     Visit source code on GitHub. */}
      {/*   </Link> */}
      {/* </Card.Footer> */}
    </Card>
  )
}
