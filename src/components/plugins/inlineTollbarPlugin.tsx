import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useState } from 'react'

export default function InlineToolbarPlugin() {
  const [editor] = useLexicalComposerContext()

  const [formats, setFormats] = useState({
    isBold: false,
    isUnderline: false,
    isStrikethrough: false,
    isItalic: false,
    isCode: false,
    isSubscript: false,
    isSuperscript: false,
  })

  const updateFormat = (key: string, value: boolean) => {
    setFormats((prevFormats) => ({
      ...prevFormats,
      [key]: value,
    }))
  }

  return <div className="flex space-x-3"></div>
}
