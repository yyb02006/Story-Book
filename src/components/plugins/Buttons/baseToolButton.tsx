import { BlockType, SupportedBlockType } from '#/components/plugins/blockTypes'
import { ButtonSize } from '#/components/plugins/Buttons/buttonTypes'
import ToolbarIcon from '#/components/plugins/Buttons/toolbarIcon'
import { cls } from '#/libs/client/utils'
import { SyntheticEvent } from 'react'

interface ToolButtonProps {
  selectedBlockType?: BlockType
  buttonBlockType: BlockType
  buttonSize: ButtonSize
  className?: string
  onClick: (event?: SyntheticEvent<HTMLButtonElement>) => void
}

export default function BaseToolButton({
  selectedBlockType,
  buttonBlockType,
  buttonSize,
  className = '',
  onClick,
}: ToolButtonProps) {
  const clickHandler = (event: SyntheticEvent<HTMLButtonElement>) => {
    onClick(event)
  }
  const isSelected = selectedBlockType ? selectedBlockType === buttonBlockType : false
  return (
    <button
      type="button"
      role="checkbox"
      title={SupportedBlockType[buttonBlockType]}
      aria-label={SupportedBlockType[buttonBlockType]}
      aria-checked={isSelected}
      onClick={clickHandler}
      className={className}
    >
      <ToolbarIcon<BlockType>
        svgId={buttonBlockType}
        size={buttonSize}
        className={cls(
          isSelected ? 'text-bright-blue' : 'dark:text-dark-disabled-icon text-light-disabled-icon',
        )}
      />
    </button>
  )
}
