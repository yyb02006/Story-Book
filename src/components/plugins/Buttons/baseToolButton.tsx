import { BlockType, SupportedBlockType } from '#/components/plugins/blockTypes'
import { cfl, cls } from '#/libs/client/utils'
import { SyntheticEvent } from 'react'

interface ToolButtonProps {
  selectedBlockType: BlockType
  buttonBlockType: BlockType
  onClick: (event?: SyntheticEvent<HTMLButtonElement>) => void
}

export const BaseToolButton = ({
  selectedBlockType,
  buttonBlockType,
  onClick,
}: ToolButtonProps) => {
  const clickHandler = (event: SyntheticEvent<HTMLButtonElement>) => {
    onClick(event)
  }
  return (
    <button
      type="button"
      role="checkbox"
      title={SupportedBlockType[buttonBlockType]}
      aria-label={SupportedBlockType[buttonBlockType]}
      aria-checked={selectedBlockType === buttonBlockType}
      onClick={clickHandler}
      className={cls(
        selectedBlockType === buttonBlockType ? 'text-rose-400' : '',
        'aria-checked:bg-green-500',
        // aria-checked에 checked상태보다 자바스크립트로 조절하는 게 크로스브라우징 문제를 야기시키지 않음
        // 어디까지나 접근성 측면에서만 aria를 사용하도록
      )}
    >
      {cfl(buttonBlockType)}
    </button>
  )
}
