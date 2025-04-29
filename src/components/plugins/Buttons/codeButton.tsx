import { codeNode } from '#/components/plugins/blockTypes'
import BaseToolButton from '#/components/plugins/Buttons/baseToolButton'
import { buttonSizes, CommonToolButtonProps } from '#/components/plugins/Buttons/buttonTypes'
import ToolbarIcon from '#/components/plugins/Buttons/toolbarIcon'
import { CODE_LANGUAGE_COMMAND } from '#/components/plugins/codeHighlightPlugin'
import { formatCode } from '#/components/plugins/utils'
import { cls } from '#/libs/client/utils'
import { CODE_LANGUAGE_FRIENDLY_NAME_MAP } from '@lexical/code'
import { $getSelection, $isRangeSelection } from 'lexical'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { $isCodeNode } from '@lexical/code'

const codeLanguagesOptions = Object.entries(CODE_LANGUAGE_FRIENDLY_NAME_MAP).map(
  ([value, label]) => ({ value, label }),
)

interface CodeDropDownProps extends Omit<CommonToolButtonProps, 'buttonSize'> {
  setIsDropdownListOpen: Dispatch<SetStateAction<boolean>>
  isDropdownListOpen: boolean
  codeLanguage: string
  languageClickHandler: (value: string) => void
}

const CodeDropDown = ({
  selectedBlockType,
  codeLanguage,
  isDropdownListOpen,
  languageClickHandler,
  setIsDropdownListOpen,
}: CodeDropDownProps) => {
  const isLanguageSelected = (value: string) => {
    // formatCode로 코드 블럭을 만들었을 때 language의 기본값은 javascript임
    // 그러나 codeLanguagesOptions에는 javascript가 아닌 js를 사용함
    // javascript !== js 값 불일치 발생 => 현재 선택된 리스트에 제대로 반영되지 못함
    // 거시기 렉시컬 레포지토리에 PR 올려봐야할듯
    const normalizedLanguage = codeLanguage === 'javascript' ? 'js' : codeLanguage
    return normalizedLanguage === value && selectedBlockType === 'code'
  }
  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsDropdownListOpen((p) => !p)
        }}
      >
        <ToolbarIcon
          className="dark:text-dark-disabled-icon text-light-disabled-icon"
          size={buttonSizes.xs}
          svgId="chevron-down"
        />
      </button>
      {isDropdownListOpen ? (
        <ul className="input-text-color-theme absolute left-0 h-[200px] overflow-hidden rounded-lg">
          <div className="scrollbar scrollbar-w-1 scrollbar-thumb-bright-blue h-full overflow-y-scroll">
            {codeLanguagesOptions.map(({ label, value }) => (
              <li
                key={value}
                onClick={() => {
                  languageClickHandler(value)
                }}
                className={cls(
                  isLanguageSelected(value) ? 'text-bright-blue' : '',
                  'dark:hover:bg-midnight-gray cursor-pointer px-2 py-1 whitespace-nowrap hover:bg-[#a0a0a0] nth-[1]:pt-2 nth-last-[1]:pb-2',
                )}
              >
                {label}
              </li>
            ))}
          </div>
        </ul>
      ) : null}
    </div>
  )
}

export default function CodeButton({
  selectedBlockType,
  editor,
  buttonSize,
}: CommonToolButtonProps) {
  const [isDropdownListOpen, setIsDropdownListOpen] = useState<boolean>(false)
  const [codeLanguage, setCodeLanguage] = useState('')

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection)) return
        const anchorNode = selection.anchor.getNode()
        const targetNode =
          anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow()
        if ($isCodeNode(targetNode)) {
          const language = targetNode.getLanguage()
          if (!language) return
          setCodeLanguage(language)
        }
      })
    })
  }, [editor])

  const handleLanguageClick = (value: string) => {
    editor.dispatchCommand(CODE_LANGUAGE_COMMAND, value)
    if (selectedBlockType !== 'code') {
      formatCode(editor, selectedBlockType)
    }
    setIsDropdownListOpen(false)
  }

  return (
    <div className="relative flex items-center">
      <BaseToolButton
        selectedBlockType={selectedBlockType}
        buttonBlockType={codeNode}
        buttonSize={buttonSize}
        onClick={() => {
          formatCode(editor, selectedBlockType)
        }}
      />
      <CodeDropDown
        languageClickHandler={handleLanguageClick}
        codeLanguage={codeLanguage}
        isDropdownListOpen={isDropdownListOpen}
        setIsDropdownListOpen={setIsDropdownListOpen}
        editor={editor}
        selectedBlockType={selectedBlockType}
      />
    </div>
  )
}
