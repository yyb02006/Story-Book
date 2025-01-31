import { BlockType, SupportedBlockType } from '#/components/plugins/toolbarPlugin'
import { cfl } from '#/libs/client/utils'

interface ToolButtonProps {
  currentBlockType: BlockType
  nodeName: BlockType
  callback: () => void
}

export const ToolButton = ({ currentBlockType, nodeName, callback }: ToolButtonProps) => {
  return (
    <button
      type="button"
      role="checkbox"
      title={SupportedBlockType[nodeName]}
      aria-label={SupportedBlockType[nodeName]}
      aria-checked={currentBlockType === nodeName}
      onClick={callback}
      className={currentBlockType === nodeName ? 'text-rose-400' : ''}
    >
      {cfl(nodeName)}
    </button>
  )
}
