import { BlockType } from '#/components/plugins/blockTypes'
import { LexicalEditor } from 'lexical'

export const buttonSizes = { sm: 'size-[16px]', md: 'size-[24px]', lg: 'size-[32px]' } satisfies {
  [key: string]: `size-[${number}px]`
}

export interface CommonToolButtonProps {
  selectedBlockType: BlockType
  editor: LexicalEditor
}
