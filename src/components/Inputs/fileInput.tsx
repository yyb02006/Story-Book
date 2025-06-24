'use client'

import BaseInput from '#/components/Inputs/baseInput'
import { cls } from '#/libs/client/utils'
import { DragEvent, InputHTMLAttributes, useState } from 'react'

interface FileInputProps {
  name: string
  label?: { children: JSX.Element; id: string; className?: string }
  onFileDrop: (event: DragEvent<HTMLLabelElement>) => void
}

const FileInput = ({
  name,
  label,
  onFileDrop,
  ...rest
}: FileInputProps & InputHTMLAttributes<HTMLInputElement>) => {
  const [isMouseOverWithFile, setIsMouseOverWithFile] = useState(false)
  const labelClassName = label?.className || ''
  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    const items = Array.from(event.dataTransfer.items)
    const hasImage = items.some((item) => item.kind === 'file' && item.type.startsWith('image/'))

    if (hasImage && !isMouseOverWithFile) {
      setIsMouseOverWithFile(true)
    }
  }
  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    if (isMouseOverWithFile) {
      setIsMouseOverWithFile(false)
    }
  }
  return (
    <div className="text-sm">
      {label && (
        <label
          htmlFor={label.id}
          className={cls(
            'bg-charcoal-gray hover:text-bright-blue flex cursor-pointer items-center justify-center rounded-md text-sm hover:ring-2',
            isMouseOverWithFile
              ? 'text-bright-blue ring-bright-blue ring-2'
              : 'dark:text-dark-disabled-icon text-light-disabled-icon',
            labelClassName,
          )}
          onDragOver={handleDragOver}
          onDrop={onFileDrop}
          onDragLeave={handleDragLeave}
        >
          {label.children}
        </label>
      )}
      <BaseInput id={label?.id} name={name} type="file" multiple={true} {...rest} />
    </div>
  )
}

export default FileInput
