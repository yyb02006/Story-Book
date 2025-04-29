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
import { TextInput } from '#/components/Inputs'
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin'

function onError(error: unknown) {
  console.error(error)
}

const TextEditorContainer = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return (
    <div className="input-text-color-theme relative flex h-80 flex-col space-y-4 rounded-2xl p-3">
      {children}
    </div>
  )
}

const PlaceHolder = ({ children }: { children: ReactNode }) => {
  return (
    <div className="font-S-CoreDream-400 text-light-placeholder dark:text-dark-placeholder pointer-events-none absolute top-0 left-1">
      {children}
    </div>
  )
}

export function Editor() {
  const initialConfig: ComponentProps<typeof LexicalComposer>['initialConfig'] = {
    namespace: 'MyEditor',
    theme,
    onError,
    nodes,
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <TextInput
        name="title"
        value=""
        className="input-text-color-theme h-14 rounded-2xl p-3 text-base"
        placeholder="제목을 입력해주세요"
      />
      <TextEditorContainer>
        <div className="relative z-[1]">
          <ToolbarPlugin />
        </div>
        <div className="relative z-0 size-full">
          <RichTextPlugin
            contentEditable={<ContentEditable className="h-full" />}
            placeholder={<PlaceHolder>내용을 입력해주세요</PlaceHolder>}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
      </TextEditorContainer>
      <HistoryPlugin />
      <AutoFocusPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <CodeHighlightPlugin />
      <TabIndentationPlugin />
    </LexicalComposer>
  )
}
