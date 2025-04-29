import { BlockType } from '#/components/plugins/blockTypes'
import BaseToolButton from '#/components/plugins/Buttons/baseToolButton'
import { ButtonSize } from '#/components/plugins/Buttons/buttonTypes'
import { cls } from '#/libs/client/utils'
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
        <svg className="dark:text-dark-disabled-icon text-light-disabled-icon size-[12px]">
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
              className={cls(
                'dark:border-dark-border dark:bg-dark-bg border-light-border bg-light-bg relative rounded-full border',
                buttonPadding,
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
