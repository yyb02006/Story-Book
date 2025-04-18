import { BlockType, SupportedBlockType } from '#/components/plugins/blockTypes'
import ToolbarIcon from '#/components/plugins/Buttons/toolbarIcon'
import { cls } from '#/libs/client/utils'
import { SyntheticEvent } from 'react'

interface ToolButtonProps {
  selectedBlockType: BlockType
  buttonBlockType: BlockType
  onClick: (event?: SyntheticEvent<HTMLButtonElement>) => void
}

const buttonSizes = { sm: 'size-[16px]', md: 'size-[24px]', lg: 'size-[32px]' } satisfies {
  [key: string]: `size-[${number}px]`
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
    >
      <ToolbarIcon<BlockType>
        svgId={buttonBlockType}
        size={buttonSizes['md']}
        className={cls(isSelected ? 'text-rose-400' : 'text-[#777777]')}
      />
    </button>
  )
}
