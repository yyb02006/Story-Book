import { BlockType } from '#/components/plugins/blockTypes'
import { LexicalEditor } from 'lexical'

export interface CommonToolButtonProps {
  selectedBlockType: BlockType
  editor: LexicalEditor
}
