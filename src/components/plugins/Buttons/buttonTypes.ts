import { BlockType } from '#/components/plugins/blockTypes'
import { LexicalEditor } from 'lexical'

export const buttonSizes = {
  xs: 'size-[12px]',
  sm: 'size-[16px]',
  md: 'size-[24px]',
  lg: 'size-[32px]',
} satisfies {
  [key: string]: `size-[${number}px]`
}

export type ButtonSize = ValueOf<typeof buttonSizes>

export interface CommonToolButtonProps {
  selectedBlockType: BlockType
  editor: LexicalEditor
  buttonSize: ButtonSize
  themeMode: ThemeMode
}
