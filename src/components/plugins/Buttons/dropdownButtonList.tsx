import { BlockType } from '#/components/plugins/blockTypes'
import BaseToolButton from '#/components/plugins/Buttons/baseToolButton'
import { ButtonSize } from '#/components/plugins/Buttons/buttonTypes'
import { themeColorStyles } from '#/libs/client/constants'
import { cls } from '#/libs/client/utils'
import { useState } from 'react'

interface DropdownListProps<T> {
  List: T[]
  selectedBlockType: BlockType
  buttonSize: ButtonSize
  onSelect: (arg: T) => void
  defaultButtonState: T
  themeMode: ThemeMode
}

export default function DropdownButtonList<T extends BlockType>({
  List,
  selectedBlockType,
  buttonSize,
  onSelect,
  defaultButtonState,
  themeMode,
}: DropdownListProps<T>) {
  const [isDropdownListOpen, setIsDropdownListOpen] = useState<boolean>(false)
  const handleClick = () => {
    setIsDropdownListOpen((p) => !p)
  }

  const resolvedListType = (List as string[]).includes(selectedBlockType)
    ? (selectedBlockType as (typeof List)[number])
    : defaultButtonState

  const { border, bgColor } = themeColorStyles[themeMode]

  const [containerLeft, buttonPadding] = ['-left-2', 'p-2']

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
        <svg className="size-[12px] text-[#808080]">
          <use href={`icons/toolbarButtons.svg#chevron-down`} />
        </svg>
      </button>
      {isDropdownListOpen ? (
        <div
          className={cls('absolute top-6 mt-2 flex flex-col space-y-1', containerLeft)}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          {List.map((node) => (
            <BaseToolButton
              key={node}
              buttonBlockType={node}
              onClick={() => {
                onSelect(node)
              }}
              selectedBlockType={selectedBlockType}
              buttonSize={buttonSize}
              className={cls('relative rounded-full border', border, bgColor, buttonPadding)}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
