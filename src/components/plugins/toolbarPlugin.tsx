import { ToolButton } from '#/components/plugins/toolbuttons'
import { cfl } from '#/libs/client/utils'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  HeadingTagType,
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import { $getSelection, $isRangeSelection } from 'lexical'
import { useEffect, useState } from 'react'

export const SupportedBlockType = {
  paragraph: 'Paragraph',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  quote: 'Quote',
} as const

export type BlockType = keyof typeof SupportedBlockType

const availableNodes = {
  heading: ['h1', 'h2', 'h3', 'h4'] as const,
  quote: 'quote',
} as const

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

  const createQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode())
        }
      })
    }
  }

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection)) return
        const anchorNode = selection.anchor.getNode()
        const targetNode =
          anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow()
        if ($isHeadingNode(targetNode)) {
          const tag = targetNode.getTag()
          setBlockType(tag)
        } else {
          const nodeType = targetNode.getType()
          if (nodeType in SupportedBlockType) {
            setBlockType(nodeType as BlockType)
          } else {
            setBlockType('paragraph')
          }
        }
      })
    })
  }, [editor])

  return (
    <div>
      {availableNodes.heading.map((heading) => {
        return (
          <ToolButton
            currentBlockType={blockType}
            nodeName={heading}
            callback={() => {
              createHeading(heading)
            }}
            key={heading}
          />
        )
      })}
      <ToolButton
        currentBlockType={blockType}
        nodeName={availableNodes.quote}
        callback={() => {
          createQuote()
        }}
      />
    </div>
  )
}
