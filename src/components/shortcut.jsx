import { useEffect, useState } from 'react'
import { Avatar, Badge, Button, Card, Input, Loading } from '@nextui-org/react'
import ShortcutCard from '@/components/shortcutCard'
import { signIn } from 'next-auth/react'
import { decodeHtml, timeAgo } from '../lib/helpers.js'
import { useSession } from 'next-auth/react'

const SHORCUT_USER_ID = '600168ef-5cec-450b-90ba-4a497a949263'
const COMPLETE_STATE_IDS = [
  500000971, // Design - Done
  500000011, // Engineering - Completed
  500016761, // Engineering - Unscheduled
]

export default function Shortcut() {
  const { data: session } = useSession()
  const [filter, setFilter] = useState('')
  const [stories, setStories] = useState([])
  const [epics, setEpics] = useState([])
  const [workflows, setWorkflows] = useState([])
  const [originalStories, setOriginalStories] = useState([])

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
      // EPICS
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

      // WORKFLOWS
      const workflowRes = await fetch(
        'https://api.app.shortcut.com/api/v3/workflows',
        {
          headers: {
            'Shortcut-Token': process.env.NEXT_PUBLIC_SHORTCUT_KEY,
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
      setWorkflows(workflowStates)

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
        setStories(
          data.data.filter(
            (story) => !COMPLETE_STATE_IDS.includes(story.workflow_state_id)
          )
        )
        console.log('stories', stories)
        setOriginalStories(data.data)
      } else {
        throw new Error('Failed to fetch')
      }
    } catch (e) {
      console.error(e)
    }
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
          <Avatar
            squared
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
              <ShortcutCard
                epics={epics}
                workflows={workflows}
                story={story}
                key={story.id}
              />
              /* <li key={story.id} className="m-0 p-0"> */
              /*   <a */
              /*     href={story.app_url} */
              /*     target="_blank" */
              /*     rel="noopener noreferer noreferrer" */
              /*     className="flex flex-col items-start justify-start rounded-md p-2 hover:cursor-pointer hover:bg-gray-800" */
              /*   > */
              /*     <span className="flex w-full items-center justify-start gap-2 text-lg font-extralight"> */
              /*       <Badge */
              /*         variant="flat" */
              /*         color="primary" */
              /*         size="md" */
              /*         disableOutline */
              /*         className="w-14" */
              /*       > */
              /*         {story.id} */
              /*       </Badge> */
              /*       <div className="flex flex-grow flex-col items-start justify-center"> */
              /*         {story.epic_id ? ( */
              /*           <span className="font-mono text-sm font-light text-slate-400"> */
              /*             {epics.find((epic) => epic.id === story.epic_id).name} */
              /*           </span> */
              /*         ) : null} */
              /*         <span className="">{story.name}</span> */
              /*         <div className="flex items-center justify-start"> */
              /*           <Badge */
              /*             variant="flat" */
              /*             color="primary" */
              /*             size="md" */
              /*             disableOutline */
              /*             className="mr-2 text-sm uppercase text-slate-300" */
              /*           > */
              /*             {story.story_type.charAt(0)} */
              /*           </Badge> */
              /*           <span className="mr-2 text-sm text-slate-300"> */
              /*             { */
              /*               workflows.find((wf) => wf.id === story.workflow_id) */
              /*                 ?.name */
              /*             }{' '} */
              /*             -{' '} */
              /*             { */
              /*               workflows */
              /*                 .find((wf) => wf.id === story.workflow_id) */
              /*                 ?.states.find( */
              /*                   (state) => state.id === story.workflow_state_id */
              /*                 )?.name */
              /*             } */
              /*           </span> */
              /*         </div> */
              /*       </div> */
              /*     </span> */
              /*   </a> */
              /* </li> */
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
              <Loading type="points-opacity" />
            </div>
          )}
        </ul>
      </Card.Body>
    </Card>
  )
}
