'use client'

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { ComponentProps, Dispatch, ReactNode, SetStateAction, useState } from 'react'
import { nodes } from '#/lexical/nodes/EditorNodes'
import { ToolbarPlugin } from '#/lexical/plugins/toolbarPlugin'
import theme from '#/lexical/styles/editorTheme'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import CodeHighlightPlugin from '#/lexical/plugins/codeHighlightPlugin'
import { TextInput } from '#/components/Inputs'
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin'
import InlineToolbarPlugin from '#/lexical/plugins/inlineToolbarPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import FloatingLinkEditorPlugin from '#/lexical/plugins/FloatingLinkEditorPlugin'
import ImagesPlugin from '#/lexical/plugins/ImagesPlugin'
import AssetToolbarPlugin from '#/lexical/plugins/assetToolbarPlugin'
import ElementAlignToolbarPlugin from '#/lexical/plugins/ElementAlignToolbarPlugin'
import ImageListPlugin from '#/lexical/plugins/ImageListPlugin'
import SubmitPlugin from '#/lexical/plugins/SubmitPlugin'
import { cls } from '#/libs/client/utils'
import { BlockType } from '#/lexical/plugins/blockTypes'

export type SubmitStatus = {
  error: { title: string[]; editor: string }
  status: 'success' | 'pending' | 'failed' | 'initial'
}

function onError(error: unknown) {
  console.error(error)
}

const TextEditorContainer = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return (
    <div className="input-color-theme relative flex h-fit min-h-80 flex-col space-y-4 rounded-2xl p-3">
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

const ToolbarContainer = ({
  setIsLinkEditMode,
}: {
  setIsLinkEditMode: Dispatch<SetStateAction<boolean>>
}) => {
  const [selectedBlockType, setSelectedBlockType] = useState<BlockType>('paragraph')

  return (
    <div className="relative z-[1] flex h-8 items-center gap-x-3">
      <ToolbarPlugin
        selectedBlockType={selectedBlockType}
        setSelectedBlockType={setSelectedBlockType}
      />
      {selectedBlockType !== 'code' && (
        <>
          <div className="bg-midnight-gray mx-1 h-[70%] w-[3px]" />
          <InlineToolbarPlugin
            selectedBlockType={selectedBlockType}
            setIsLinkEditMode={setIsLinkEditMode}
          />
          <div className="bg-midnight-gray mx-1 h-[70%] w-[3px]" />
          <AssetToolbarPlugin />
          <div className="bg-midnight-gray mx-1 h-[70%] w-[3px]" />
          <ElementAlignToolbarPlugin />
        </>
      )}
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

  const [isLinkEditMode, setIsLinkEditMode] = useState(false)
  const [floatingAnchorElement, setFloatingAnchorElement] = useState<HTMLDivElement | null>(null)
  const [title, setTitle] = useState('')
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
    error: { title: [''], editor: '' },
    status: 'initial',
  })

  const onFloatingAnchorRef = (_floatingAnchorElement: HTMLDivElement) => {
    if (_floatingAnchorElement !== null) {
      setFloatingAnchorElement(_floatingAnchorElement)
    }
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative h-14 rounded-2xl">
        <TextInput
          name="title"
          value={title}
          className="input-color-theme peer h-full w-full rounded-2xl p-3 text-base"
          placeholder=""
          maxLength={200}
          onChange={(value) => {
            if (submitStatus.status === 'pending') return
            if (value.length > 0) {
              setSubmitStatus((p) => ({ ...p, error: { title: [], editor: '' } }))
            }
            setTitle(value)
          }}
        />
        <div
          className={cls(
            title.length > 0 ? 'invisible' : 'visible',
            `input-color-theme text-light-placeholder dark:text-dark-placeholder pointer-events-none absolute top-0 flex h-full w-full items-center rounded-2xl p-4 leading-0 peer-focus:invisible`,
          )}
        >
          제목을 입력해주세요
          <span className="-translate-y-1 text-red-500">*</span>
        </div>
        {submitStatus.error.title.length > 0 ? (
          <div className="font-S-CoreDream-200 absolute mt-1 text-[13px] text-red-400">
            {submitStatus.error.title.map((err) => err)}
          </div>
        ) : null}
      </div>
      <TextEditorContainer>
        <ToolbarContainer setIsLinkEditMode={setIsLinkEditMode} />
        <div className="relative z-0 grow">
          <RichTextPlugin
            contentEditable={
              <div ref={onFloatingAnchorRef}>
                <ContentEditable className="ContentEditable__root font-S-CoreDream-200 h-full" />
              </div>
            }
            placeholder={<PlaceHolder>내용을 입력해주세요</PlaceHolder>}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <ImageListPlugin />
      </TextEditorContainer>
      <HistoryPlugin />
      <AutoFocusPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <CodeHighlightPlugin />
      <TabIndentationPlugin />
      <LinkPlugin />
      <ImagesPlugin />
      {floatingAnchorElement && (
        <FloatingLinkEditorPlugin
          floatingAnchorElement={floatingAnchorElement}
          isLinkEditMode={isLinkEditMode}
          setIsLinkEditMode={setIsLinkEditMode}
        />
      )}
      <SubmitPlugin title={title} submitStatus={submitStatus} setSubmitStatus={setSubmitStatus} />
    </LexicalComposer>
  )
}
