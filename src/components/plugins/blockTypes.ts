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

export const headingNodes = ['h1', 'h2', 'h3', 'h4'] as const

export const listNodes = ['bullet', 'number', 'check'] as const

export const availableNodes = {
  heading: headingNodes,
  quote: 'quote',
  list: listNodes,
} as const
