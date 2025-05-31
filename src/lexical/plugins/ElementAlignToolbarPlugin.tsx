import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $getSelection,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  $isElementNode,
  $isRangeSelection,
} from 'lexical'
import { $findMatchingParent } from '@lexical/utils'
import { $isLinkNode } from '@lexical/link'
import { useEffect, useRef, useState } from 'react'
import { getSelectedNode } from '#/lexical/plugins/utils'
import { cls } from '#/libs/client/utils'
import ToolbarIcon from '#/lexical/components/Buttons/toolbarIcon'
import { buttonSizes } from '#/lexical/components/Buttons/buttonTypes'

const AlignButton = ({
  align,
  onClick,
  className = '',
}: {
  align: ElementFormatType
  onClick: () => void
  className?: string
}) => {
  return (
    <button
      type="button"
      title={`align-${align}`}
      aria-label={`align-${align}`}
      onClick={onClick}
      className="list-none"
    >
      <ToolbarIcon size={buttonSizes['md']} svgId={`align-${align}`} className={className} />
    </button>
  )
}

export default function ElementAlignToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [currentAlignment, setCurrentAlignment] = useState<ElementFormatType>('left')
  const [isDropdownListOpen, setIsDropdownListOpen] = useState<boolean>(false)
  const handleClick = () => {
    setIsDropdownListOpen((p) => !p)
  }

  const alignments = useRef<ElementFormatType[]>(['left', 'right', 'center', 'justify'])

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection)) return
        const node = getSelectedNode(selection)
        const parent = node.getParent()
        let matchingParent
        if ($isLinkNode(parent)) {
          // If node is a link, we need to fetch the parent paragraph node to set format
          matchingParent = $findMatchingParent(
            node,
            (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),
          )
        }
        const test = $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() || 'left'

        setCurrentAlignment(test)
      })
    })
  }, [editor])
  const [containerLeft, buttonPadding] = ['-left-2', 'p-2']
  return (
    <div className="relative flex items-center">
      <AlignButton
        onClick={handleClick}
        align={currentAlignment || 'left'}
        className="dark:text-dark-disabled-icon text-light-disabled-icon"
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
          {alignments.current.map((alignment) => (
            <AlignButton
              key={alignment}
              onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment)
              }}
              align={alignment}
              className={cls(
                'dark:text-dark-disabled-icon hover:text-bright-blue text-light-disabled-icon dark:border-dark-border dark:bg-dark-bg border-light-border bg-light-bg relative box-content rounded-full border',
                buttonPadding,
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
