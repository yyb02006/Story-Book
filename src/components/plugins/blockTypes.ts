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

const availableNodes = {
  headingNodes: ['h1', 'h2', 'h3', 'h4'],
  quoteNode: 'quote',
  listNodes: ['bullet', 'number', 'check'],
} as const satisfies { [key: string]: BlockType[] | BlockType }

export const { headingNodes, quoteNode, listNodes } = availableNodes
