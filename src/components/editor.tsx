import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { ComponentProps } from 'react'
import { nodes } from '#/libs/client/nodes'
import { Toolbar } from '#/components/plugins/toolbarPlugin'
import { theme } from '#/components/editorTheme'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: unknown) {
  console.error(error)
}

export function Editor() {
  console.log(theme)

  const initialConfig: ComponentProps<typeof LexicalComposer>['initialConfig'] = {
    namespace: 'MyEditor',
    theme,
    onError,
    nodes,
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Toolbar />
      <div className="relative h-40 bg-[#202020]">
        <RichTextPlugin
          contentEditable={<ContentEditable className="h-full" />}
          placeholder={
            <div className="pointer-events-none absolute left-0 top-0">Enter some text...</div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
      <HistoryPlugin />
      <AutoFocusPlugin />
      <ListPlugin />
      <CheckListPlugin />
    </LexicalComposer>
  )
}
