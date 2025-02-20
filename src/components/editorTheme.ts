import { EditorThemeClasses } from 'lexical'
import editorTheme from '#/components/editorTheme.module.css'

export const theme: EditorThemeClasses = {
  heading: {
    h1: editorTheme.h1,
    h2: editorTheme.h2,
    h3: editorTheme.h3,
    h4: editorTheme.h4,
  },
  quote: editorTheme.quote,
  list: {
    ol: editorTheme.ol,
    ul: editorTheme.ul,
    listitem: editorTheme.li,
  },
}
