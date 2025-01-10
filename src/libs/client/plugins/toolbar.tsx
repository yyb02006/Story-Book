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
  return (
    <div>
      <button
        type="button"
        role="checkbox"
        title={SupportedBlockType['h1']}
        aria-label={SupportedBlockType['h1']}
        aria-checked={blockType === 'h1'}
      >
        H1
      </button>
    </div>
  )
}
