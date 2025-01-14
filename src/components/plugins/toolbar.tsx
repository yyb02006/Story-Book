import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { HeadingTagType, $createHeadingNode } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import { $getSelection, $isRangeSelection } from 'lexical'
import { useState } from 'react'

const SupportedBlockType = {
  paragraph: 'Paragraph',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
} as const

type BlockType = keyof typeof SupportedBlockType

export const Toolbar = () => {
  const [blockType, setBlockType] = useState<BlockType>('paragraph')
  const [editor] = useLexicalComposerContext()

  const createHeading = (type: HeadingTagType) => {
    if (blockType !== type) {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(type))
        }
      })
    }
  }

  return (
    <div>
      <button
        type="button"
        role="checkbox"
        title={SupportedBlockType['h1']}
        aria-label={SupportedBlockType['h1']}
        aria-checked={blockType === 'h1'}
        onClick={() => {
          createHeading('h1')
        }}
      >
        H1
      </button>
      <button
        type="button"
        role="checkbox"
        title={SupportedBlockType['h2']}
        aria-label={SupportedBlockType['h2']}
        aria-checked={blockType === 'h2'}
        onClick={() => {
          createHeading('h2')
        }}
      >
        H2
      </button>
      <button
        type="button"
        role="checkbox"
        title={SupportedBlockType['h3']}
        aria-label={SupportedBlockType['h3']}
        aria-checked={blockType === 'h3'}
        onClick={() => {
          createHeading('h3')
        }}
      >
        H3
      </button>
      <button
        type="button"
        role="checkbox"
        title={SupportedBlockType['h4']}
        aria-label={SupportedBlockType['h4']}
        aria-checked={blockType === 'h4'}
        onClick={() => {
          createHeading('h4')
        }}
      >
        H4
      </button>
    </div>
  )
}
