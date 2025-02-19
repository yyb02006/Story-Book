import { EditorThemeClasses } from 'lexical'
import editorTheme from '#/components/editorTheme.module.css'

export const theme: EditorThemeClasses = {
  quote: editorTheme.quote,
  list: {
    ol: editorTheme.ol,
    ul: editorTheme.ul,
    listitem: editorTheme.li,
  },
}
