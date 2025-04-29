import { Editor } from '#/components/editor'

export default function Write() {
  return (
    <div className="flex h-full justify-center">
      <div className="max-w-[800px] grow space-y-10 py-10">
        <h1 className="font-patrick-hand dark:text-dark-text text-midnight-gray text-4xl">
          Create Memo
        </h1>
        <Editor />
      </div>
    </div>
  )
}
