import { useEffect, useState } from 'react'
import { Loading } from '@nextui-org/react'
import { timeAgo } from '../lib/helpers.js'
import Tag from './tag'

/**
 * Algolia HN API: https://hn.algolia.com/api
 */
export default function HackerNews() {
  const [posts, setPosts] = useState([])

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

  useEffect(() => {
    fetchFrontPage()
  }, [])

  return (
    <section>
      <h1>HackerNews</h1>
      <ul>
        {posts.length > 0 ? (
          posts.map((post) => (
            <li key={post.objectID}>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferer noreferrer"
                className="flex flex-col items-start justify-start"
              >
                <div className="flex justify-start">
                  <span className="">{post.title}</span>
                </div>
                <div className="flex items-center justify-start space-x-2">
                  <Tag text={post.points} className="" />
                  <span className="text-sm">
                    {post.num_comments ?? 0} Comments
                  </span>
                  <span className="text-sm">
                    {timeAgo(post.created_at_i * 1000)}
                  </span>
                </div>
              </a>
            </li>
          ))
        ) : (
          <Loading color="secondary" />
        )}
      </ul>
    </section>
  )
}
