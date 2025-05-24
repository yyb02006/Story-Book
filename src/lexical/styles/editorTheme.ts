import { EditorThemeClasses } from 'lexical'
import editorTheme from './editorTheme.module.css'

const { h1, h2, h3, h4, listitem, listitemChecked, listitemUnchecked, ol, quote, ul, code, link } =
  editorTheme

const theme: EditorThemeClasses = {
  heading: {
    h1,
    h2,
    h3,
    h4,
  },
  quote,
  list: {
    ol,
    ul,
    listitem,
    listitemChecked,
    listitemUnchecked,
    nested: {
      listitem: editorTheme.nestedListitem,
    },
  },
  text: {
    bold: editorTheme.textBold,
    code: editorTheme.textCode,
    italic: editorTheme.textItalic,
    underline: editorTheme.textUnderline,
    strikethrough: editorTheme.textStrikethrough,
    underlineStrikethrough: editorTheme.textUnderlineStrikethrough,
    subscript: editorTheme.textSubscript,
    superscript: editorTheme.textSuperscript,
  },
  code,
  link,
  codeHighlight: {
    atrule: editorTheme.codeHighlight__tokenAttr,
    attr: editorTheme.codeHighlight__tokenAttr,
    boolean: editorTheme.codeHighlight__tokenProperty,
    builtin: editorTheme.codeHighlight__tokenSelector,
    cdata: editorTheme.codeHighlight__tokenComment,
    char: editorTheme.codeHighlight__tokenSelector,
    class: editorTheme.codeHighlight__tokenFunction,
    'class-name': editorTheme.codeHighlight__tokenFunction,
    comment: editorTheme.codeHighlight__tokenComment,
    constant: editorTheme.codeHighlight__tokenProperty,
    deleted: editorTheme.codeHighlight__tokenProperty,
    doctype: editorTheme.codeHighlight__tokenComment,
    entity: editorTheme.codeHighlight__tokenOperator,
    function: editorTheme.codeHighlight__tokenFunction,
    important: editorTheme.codeHighlight__tokenVariable,
    inserted: editorTheme.codeHighlight__tokenSelector,
    keyword: editorTheme.codeHighlight__tokenAttr,
    namespace: editorTheme.codeHighlight__tokenVariable,
    number: editorTheme.codeHighlight__tokenProperty,
    operator: editorTheme.codeHighlight__tokenOperator,
    prolog: editorTheme.codeHighlight__tokenComment,
    property: editorTheme.codeHighlight__tokenProperty,
    punctuation: editorTheme.codeHighlight__tokenPunctuation,
    regex: editorTheme.codeHighlight__tokenVariable,
    selector: editorTheme.codeHighlight__tokenSelector,
    string: editorTheme.codeHighlight__tokenSelector,
    symbol: editorTheme.codeHighlight__tokenProperty,
    tag: editorTheme.codeHighlight__tokenProperty,
    url: editorTheme.codeHighlight__tokenOperator,
    variable: editorTheme.codeHighlight__tokenVariable,
  },
}

export default theme
