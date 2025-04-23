import { EditorThemeClasses } from 'lexical'
import editorTheme from '#/components/editorTheme.module.css'

const { h1, h2, h3, h4, listitem, listitemChecked, listitemUnchecked, ol, quote, ul } = editorTheme

export const theme: EditorThemeClasses = {
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
}
