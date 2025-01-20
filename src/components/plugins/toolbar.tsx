import { cfl } from '#/libs/client/utils'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { HeadingTagType, $createHeadingNode, $isHeadingNode } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import { $getSelection, $isRangeSelection } from 'lexical'
import { useEffect, useState } from 'react'

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

const availableHeadings = ['h1', 'h2', 'h3', 'h4'] as const

interface HeadingButtonProps {
  blockType: BlockType
  headingLevel: BlockType
  callback: () => void
}

const HeadingButton = ({ blockType, headingLevel, callback }: HeadingButtonProps) => {
  return (
    <button
      type="button"
      role="checkbox"
      title={SupportedBlockType[headingLevel]}
      aria-label={SupportedBlockType[headingLevel]}
      aria-checked={blockType === headingLevel}
      onClick={callback}
      className={blockType === headingLevel ? 'text-rose-400' : ''}
    >
      {cfl(headingLevel)}
    </button>
  )
}

export const Toolbar = () => {
  const [blockType, setBlockType] = useState<BlockType>('paragraph')
  const [editor] = useLexicalComposerContext()

  const createHeading = (type: HeadingTagType) => {
    if (blockType !== type) {
      editor.update(() => {
        const selection = $getSelection()
        console.log(selection)
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(type))
        }
      })
    }
  }

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection()
        console.log($isRangeSelection(selection))
        if (!$isRangeSelection(selection)) return
        const anchorNode = selection.anchor.getNode()
        const targetNode =
          anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow()
        if ($isHeadingNode(targetNode)) {
          const tag = targetNode.getTag()
          console.log('tag', tag)
          setBlockType(tag)
        } else {
          const nodeType = targetNode.getType()
          console.log('nodeType', nodeType)
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
      {availableHeadings.map((heading) => {
        return (
          <HeadingButton
            blockType={blockType}
            headingLevel={heading}
            callback={() => {
              createHeading(heading)
            }}
            key={heading}
          ></HeadingButton>
        )
      })}
    </div>
  )
}
