import { Editor } from '#/components/editor'

export default function Write() {
  return (
    <div className="flex h-full justify-center">
      <div className="max-w-[800px] grow">
        <Editor />
      </div>
    </div>
  )
}
