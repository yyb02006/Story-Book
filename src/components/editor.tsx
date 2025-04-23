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
import { cls } from '#/libs/client/utils'
import { themeColorStyles } from '#/libs/client/constants'

function onError(error: unknown) {
  console.error(error)
}

const TextEditorContainer = ({
  children,
  themeMode,
}: {
  children: JSX.Element | JSX.Element[]
  themeMode: ThemeMode
}) => {
  return (
    <div
      className={cls(
        'relative flex h-80 flex-col space-y-4 rounded-2xl border p-3',
        themeColorStyles.border[themeMode],
        themeColorStyles.text[themeMode],
      )}
    >
      {children}
    </div>
  )
}

const PlaceHolder = ({ children, themeMode }: { children: ReactNode; themeMode: ThemeMode }) => {
  return (
    <div
      className={cls(
        'pointer-events-none absolute left-1 top-0 font-S-CoreDream-400',
        themeColorStyles.placeHolderText[themeMode],
      )}
    >
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
        className="h-14 rounded-2xl bg-dark-gray p-3 text-base"
        placeholder="제목을 입력해주세요"
        themeMode="dark"
      />
      <TextEditorContainer themeMode="dark">
        <div className="relative z-[1]">
          <ToolbarPlugin />
        </div>
        <div className="relative z-0 size-full">
          <RichTextPlugin
            contentEditable={<ContentEditable className="h-full" />}
            placeholder={<PlaceHolder themeMode="dark">내용을 입력해주세요</PlaceHolder>}
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
