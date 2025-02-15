import { ToolButton } from '#/components/plugins/toolbuttons'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  HeadingTagType,
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from '@lexical/rich-text'
import {
  $isListNode,
  ListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list'
import { $setBlocksType } from '@lexical/selection'
import { $getSelection, $isRangeSelection } from 'lexical'
import { useEffect, useState } from 'react'
import { $getNearestNodeOfType } from '@lexical/utils'

export const SupportedBlockType = {
  paragraph: 'Paragraph',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  quote: 'Quote',
  number: 'Numbered List',
  bullet: 'Bulleted List',
  check: 'Check List',
} as const

export type BlockType = keyof typeof SupportedBlockType

const headingNodes = ['h1', 'h2', 'h3', 'h4'] as const

const listNodes = ['bullet', 'number', 'check'] as const

const availableNodes = {
  heading: headingNodes,
  quote: 'quote',
  list: listNodes,
} as const

export const ToolbarPlugin = () => {
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

  const createList = (currentListNode: (typeof listNodes)[number]) => {
    switch (true) {
      case blockType !== 'bullet' && currentListNode === 'bullet':
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        break
      case blockType !== 'number' && currentListNode === 'number':
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        break
      case blockType !== 'check' && currentListNode === 'check':
        editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
        break
      default:
        break
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
        } else if ($isListNode(targetNode)) {
          const parentListNode = $getNearestNodeOfType(anchorNode, ListNode)
          const listType = parentListNode ? parentListNode.getListType() : targetNode.getListType()
          setBlockType(listType)
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
      {availableNodes.list.map((listType) => {
        return (
          <ToolButton
            currentBlockType={blockType}
            nodeName={listType}
            callback={() => {
              createList(listType)
            }}
            key={listType}
          />
        )
      })}
    </div>
  )
}
