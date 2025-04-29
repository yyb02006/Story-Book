'use client'

import { cls } from '#/libs/client/utils'
import { ReactNode, useState } from 'react'

export default function RootThemeProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState('dark')
  return <div className={cls(themeMode, 'h-full')}>{children}</div>
}
