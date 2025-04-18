import { BlockType, SupportedBlockType } from '#/components/plugins/blockTypes'
import { cls } from '#/libs/client/utils'
import { SyntheticEvent } from 'react'

interface ToolButtonProps {
  selectedBlockType: BlockType
  buttonBlockType: BlockType
  onClick: (event?: SyntheticEvent<HTMLButtonElement>) => void
}

export default function BaseToolButton({
  selectedBlockType,
  buttonBlockType,
  onClick,
}: ToolButtonProps) {
  const clickHandler = (event: SyntheticEvent<HTMLButtonElement>) => {
    onClick(event)
  }
  const isSelected = selectedBlockType === buttonBlockType
  return (
    <button
      type="button"
      role="checkbox"
      title={SupportedBlockType[buttonBlockType]}
      aria-label={SupportedBlockType[buttonBlockType]}
      aria-checked={isSelected}
      onClick={clickHandler}
      className={cls(isSelected ? 'text-rose-400' : '')}
    >
      <svg className="size-[100px]">
        <use href={`/icons/toolbarButtons.svg#${buttonBlockType}`} className="text-red-500" />
      </svg>
    </button>
  )
}
