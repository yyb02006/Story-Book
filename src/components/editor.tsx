'use client'

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { ComponentProps, ReactNode } from 'react'
import { nodes } from '#/libs/client/nodes'
import { ToolbarPlugin } from '#/components/plugins/toolbarPlugin'
import { theme } from '#/components/editorTheme'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import CodeHighlightPlugin from '#/components/plugins/codeHighlightPlugin'

function onError(error: unknown) {
  console.error(error)
}

const TextEditorContainer = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return <div className="relative h-40 bg-[#202020]">{children}</div>
}

const PlaceHolder = ({ children }: { children: ReactNode }) => {
  return <div className="pointer-events-none absolute left-0 top-0">{children}</div>
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
      <TextEditorContainer>
        <ToolbarPlugin />
        <div className="relative h-full">
          <RichTextPlugin
            contentEditable={<ContentEditable className="h-full bg-red-100" />}
            placeholder={<PlaceHolder>Enter some text...</PlaceHolder>}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
      </TextEditorContainer>
      <HistoryPlugin />
      <AutoFocusPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <CodeHighlightPlugin />
    </LexicalComposer>
  )
}
