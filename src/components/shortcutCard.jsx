import { Badge } from '@nextui-org/react'

export default function ShortcutCard({ story, workflows, epics }) {
  return (
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
            color="primary"
            size="md"
            disableOutline
            className="w-14"
          >
            {story.id}
          </Badge>
          <div className="flex flex-grow flex-col items-start justify-center">
            {story.epic_id ? (
              <span className="font-mono text-sm font-light text-slate-400">
                {epics.find((epic) => epic.id === story.epic_id).name}
              </span>
            ) : null}
            <span className="">{story.name}</span>
            <div className="flex items-center justify-start">
              <Badge
                variant="flat"
                color="primary"
                size="md"
                disableOutline
                className="mr-2 text-sm uppercase text-slate-300"
              >
                {story.story_type.charAt(0)}
              </Badge>
              <span className="mr-2 text-sm text-slate-300">
                {workflows.find((wf) => wf.id === story.workflow_id)?.name} -{' '}
                {
                  workflows
                    .find((wf) => wf.id === story.workflow_id)
                    ?.states.find(
                      (state) => state.id === story.workflow_state_id
                    )?.name
                }
              </span>
            </div>
          </div>
        </span>
      </a>
    </li>
  )
}
