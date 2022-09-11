import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { serverTiming } from '@/lib/helpers'

const wantedRepoOrgs = ['checkly']
const nicoEmails = ['yo@ndo.dev', 'bballs91@gmail.com']

const handler = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { method, query } = req

  if (!session?.user) {
    console.error('ERR - Unauthorized attempt to DELETE /api/bookmarks')
    return res.status(403).end('Unauthorized')
  }

  switch (method) {
    case 'GET': {
      serverTiming.start()

      let userEmail = query.email

      // Workaround for Nicos alternative Emails
      if (nicoEmails.includes(session.user.email)) {
        userEmail = 'nico@checklyhq.com'
      }

      // Gather all notifications from Github API
      try {
        serverTiming.measure('notifications')
        const notificationRes = await fetch(
          `https://api.github.com/notifications?${new URLSearchParams({
            all: false,
            participating: true,
            per_page: 50,
          })}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.GITHUB_PAT}`,
              Accept: 'application/vnd.github+json',
            },
          }
        )

        if (notificationRes.status !== 200) {
          return res
            .status(500)
            .json({ error: 'Error fetching Github Notifications' })
        }
        const data = await notificationRes.json()

        const notifications = data
          .filter((item) => {
            // Don't include notifications about my own commits to my own PRs
            return !(
              item.reason === 'author' &&
              item.repository?.owner?.login === 'ndom91'
            )
          })
          .sort((a, b) => a.updated_at > b.updated_at)

        serverTiming.measure('notifications')

        res.setHeader('Server-Timing', serverTiming.setHeader())
        res.setHeader('Access-Control-Allow-Origin', '*')
        return res.status(200).json({ notifications })
      } catch (error) {
        console.error('ERR', error)
        return res.status(500).json({ error })
      }
    }
    default: {
      res.setHeader('Allow', ['GET'])
      return res.status(405).end(`Method ${method} Not Allowed`)
    }
  }
}

export default handler
