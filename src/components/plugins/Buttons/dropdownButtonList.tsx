import { BlockType } from '#/components/plugins/blockTypes'
import BaseToolButton from '#/components/plugins/Buttons/baseToolButton'
import { ButtonSize } from '#/components/plugins/Buttons/buttonTypes'
import { useState } from 'react'

interface DropdownListProps<T> {
  List: T[]
  selectedBlockType: BlockType
  buttonSize: ButtonSize
  onSelect: (arg: T) => void
  defaultButtonState: T
}

export default function DropdownButtonList<T extends BlockType>({
  List,
  selectedBlockType,
  buttonSize,
  onSelect,
  defaultButtonState,
}: DropdownListProps<T>) {
  const [isDropdownListOpen, setIsDropdownListOpen] = useState<boolean>(false)
  const handleClick = () => {
    setIsDropdownListOpen((p) => !p)
  }

  const resolvedListType = (List as string[]).includes(selectedBlockType)
    ? (selectedBlockType as (typeof List)[number])
    : defaultButtonState

  return (
    <div className="relative flex items-center">
      <BaseToolButton
        buttonBlockType={resolvedListType}
        buttonSize={buttonSize}
        selectedBlockType={selectedBlockType}
        onClick={() => {
          onSelect(resolvedListType)
        }}
      />
      <button onClick={handleClick}>
        <svg className="size-[12px] text-[#777777]">
          <use href={`icons/toolbarButtons.svg#chevron-down`} />
        </svg>
      </button>
      <div
        className="absolute left-0 top-6 flex w-full flex-col bg-[#202020]"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
      >
        {isDropdownListOpen
          ? List.map((node) => (
              <BaseToolButton
                key={node}
                buttonBlockType={node}
                onClick={() => {
                  onSelect(node)
                }}
                selectedBlockType={selectedBlockType}
                buttonSize={buttonSize}
              />
            ))
          : null}
      </div>
    </div>
  )
}
