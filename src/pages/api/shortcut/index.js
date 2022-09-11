import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { serverTiming } from '@/lib/helpers'

const SHORCUT_NDOM91_ID = '600168ef-5cec-450b-90ba-4a497a949263' // ndom91
const COMPLETE_STATE_IDS = [
  500000971, // Design - Done
  500000011, // Engineering - Completed
  500016761, // Engineering - Unscheduled
]
const nicoEmails = ['yo@ndo.dev', 'bballs91@gmail.com']

const handler = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { method, query } = req

  if (!session?.user || !process.env.SHORTCUT_KEY) {
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

      // Gather all required info from Shortcut API
      try {
        // MEMBERS
        serverTiming.measure('members')
        const memberRes = await fetch(
          'https://api.app.shortcut.com/api/v3/members',
          {
            headers: {
              'Shortcut-Token': process.env.SHORTCUT_KEY,
              'Content-Type': 'application/json',
            },
          }
        )
        const memberData = await memberRes.json()
        const activeMembers = memberData
          .filter((member) => {
            return !member.disabled && !member.profile.deactivated
          })
          .map((member) => {
            return {
              id: member.id,
              name: member.profile.name,
              email: member.profile.email_address,
            }
          })

        const shortcutUserId = userEmail
          ? activeMembers.find((member) => member.email === userEmail)?.id
          : SHORCUT_NDOM91_ID

        serverTiming.measure('members')

        // EPICS
        serverTiming.measure('epics')
        const epicRes = await fetch(
          'https://api.app.shortcut.com/api/v3/epics',
          {
            headers: {
              'Shortcut-Token': process.env.SHORTCUT_KEY,
              'Content-Type': 'application/json',
            },
          }
        )
        const epicData = await epicRes.json()
        const teamEpics = epicData.filter((epic) => {
          return epic.owner_ids.includes(shortcutUserId ?? SHORCUT_NDOM91_ID)
        })
        serverTiming.measure('epics')

        // WORKFLOWS
        serverTiming.measure('workflows')
        const workflowRes = await fetch(
          'https://api.app.shortcut.com/api/v3/workflows',
          {
            headers: {
              'Shortcut-Token': process.env.SHORTCUT_KEY,
              'Content-Type': 'application/json',
            },
          }
        )
        const workflowData = await workflowRes.json()
        const workflowStates = workflowData.map((workflow) => {
          return {
            id: workflow.id,
            name: workflow.name,
            states: workflow.states.map((state) => ({
              name: state.name,
              id: state.id,
            })),
          }
        })
        serverTiming.measure('workflows')

        // STORIES
        serverTiming.measure('stories')
        const storyRes = await fetch(
          `https://api.app.shortcut.com/api/v3/search/stories?${new URLSearchParams(
            {
              query: 'owner:ndom91 !state:"Complete" !is:archived',
            }
          )}`,
          {
            headers: {
              'Shortcut-Token': process.env.SHORTCUT_KEY,
              'Content-Type': 'application/json',
            },
          }
        )

        const storyData = await storyRes.json()
        const stories = storyData.data
          .filter(
            (story) => !COMPLETE_STATE_IDS.includes(story.workflow_state_id)
          )
          .sort((a, b) => a.updated_at < b.updated_at)

        serverTiming.measure('stories')

        res.setHeader('Server-Timing', serverTiming.setHeader())
        res.setHeader('Access-Control-Allow-Origin', '*')
        return res.status(200).json({
          stories,
          workflows: workflowStates,
          epics: teamEpics,
          members: activeMembers,
        })
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
