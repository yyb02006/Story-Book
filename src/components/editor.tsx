import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { ComponentProps } from 'react'
import { nodes } from '#/libs/client/nodes'
import { Toolbar } from '#/components/plugins/toolbar'

const theme = {
  // Theme styling goes here
  //...
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: unknown) {
  console.error(error)
}

export function Editor() {
  const initialConfig: ComponentProps<typeof LexicalComposer>['initialConfig'] = {
    namespace: 'MyEditor',
    theme,
    onError,
    nodes: nodes,
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Toolbar />
      <div className="relative">
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<div className="absolute left-0 top-0">Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
      <HistoryPlugin />
      <AutoFocusPlugin />
    </LexicalComposer>
  )
}
