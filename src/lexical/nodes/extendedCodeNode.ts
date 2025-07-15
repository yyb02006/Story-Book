import { CodeNode } from '@lexical/code'
import { $applyNodeReplacement, EditorConfig } from 'lexical'
import { addClassNamesToElement } from '@lexical/utils'
import { CODE_LANGUAGE_FRIENDLY_NAME_MAP, SerializedCodeNode } from '@lexical/code'

const LANGUAGE_DATA_ATTRIBUTE = 'data-language'
const PRETTY_LANGUAGE_DATA_ATTRIBUTE = 'data-pretty-language'
const HIGHLIGHT_LANGUAGE_DATA_ATTRIBUTE = 'data-highlight-language'

export class ExtendedCodeNode extends CodeNode {
  static getType() {
    return 'code'
  }
  static clone(node: CodeNode) {
    return new ExtendedCodeNode(node.__language, node.__key)
  }
  static importJSON(serializedNode: SerializedCodeNode): ExtendedCodeNode {
    return new ExtendedCodeNode(serializedNode.language).updateFromJSON(serializedNode)
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement('code')
    addClassNamesToElement(element, config.theme.code)
    element.setAttribute('spellcheck', 'false')

    const language = this.getLanguage()
    if (language) {
      element.setAttribute(LANGUAGE_DATA_ATTRIBUTE, language)

      if (this.getIsSyntaxHighlightSupported()) {
        element.setAttribute(HIGHLIGHT_LANGUAGE_DATA_ATTRIBUTE, language)
      }

      const normalizedLanguage = language === 'javascript' ? 'js' : language

      const pretty = CODE_LANGUAGE_FRIENDLY_NAME_MAP[normalizedLanguage]
      console.log(language)

      if (pretty) {
        element.setAttribute(PRETTY_LANGUAGE_DATA_ATTRIBUTE, pretty)
      }
    }

    return element
  }

  updateDOM(prevNode: this, dom: HTMLElement): boolean {
    const language = this.__language
    const prevLanguage = prevNode.__language

    if (language) {
      if (language !== prevLanguage) {
        dom.setAttribute(LANGUAGE_DATA_ATTRIBUTE, language)

        if (this.__isSyntaxHighlightSupported) {
          dom.setAttribute(HIGHLIGHT_LANGUAGE_DATA_ATTRIBUTE, language)
        }

        const pretty = CODE_LANGUAGE_FRIENDLY_NAME_MAP[language]
        if (pretty) {
          dom.setAttribute(PRETTY_LANGUAGE_DATA_ATTRIBUTE, pretty)
        } else {
          dom.removeAttribute(PRETTY_LANGUAGE_DATA_ATTRIBUTE)
        }
      }
    } else if (prevLanguage) {
      dom.removeAttribute(LANGUAGE_DATA_ATTRIBUTE)

      if (prevNode.__isSyntaxHighlightSupported) {
        dom.removeAttribute(HIGHLIGHT_LANGUAGE_DATA_ATTRIBUTE)
      }

      dom.removeAttribute(PRETTY_LANGUAGE_DATA_ATTRIBUTE)
    }

    return false
  }
}

export function $createExtendedCodeNode(language?: string | null | undefined): ExtendedCodeNode {
  return $applyNodeReplacement(new ExtendedCodeNode(language))
}
