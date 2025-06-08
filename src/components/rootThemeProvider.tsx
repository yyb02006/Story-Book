'use client'

import { cls } from '#/libs/client/utils'
import { ReactNode, useState } from 'react'

export default function RootThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark')
  return (
    <div className={cls(themeMode, 'dark:bg-smooth-black bg-smooth-white h-full')}>{children}</div>
  )
}
