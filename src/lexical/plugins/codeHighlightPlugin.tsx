import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { registerCodeHighlighting, $isCodeNode } from '@lexical/code'
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  LexicalEditor,
  createCommand,
} from 'lexical'
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
import { ExtendedCodeNode } from '#/lexical/nodes/extendedCodeNode'

export const CODE_LANGUAGE_COMMAND = createCommand<string>()

const registerCodeLanguageSelecting = (editor: LexicalEditor) => {
  return editor.registerCommand(
    CODE_LANGUAGE_COMMAND,
    (language, editor) => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection)) return false
      const ancherNode = selection.anchor.getNode()

      const targetNode = $isCodeNode(ancherNode)
        ? ancherNode
        : $getNearestNodeOfType(ancherNode, ExtendedCodeNode)

      if (!targetNode) return false

      editor.update(() => {
        targetNode.setLanguage(language)
      })
      return true
    },
    COMMAND_PRIORITY_CRITICAL,
  )
}

export default function CodeHighlightPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return mergeRegister(registerCodeHighlighting(editor), registerCodeLanguageSelecting(editor))
  }, [editor])

  return null
}
