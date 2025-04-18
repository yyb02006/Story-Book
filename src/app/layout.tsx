import type { Metadata } from 'next'
import { Inter, Patrick_Hand } from 'next/font/google'
import './globals.css'
import GlobalNav from '#/components/nav/globalNav'
import { cls } from '#/libs/client/utils'

const inter = Inter({ subsets: ['latin'] })
const patrick_hand = Patrick_Hand({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-patrick-hand',
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cls(inter.className, patrick_hand.variable)}>
        <GlobalNav />
        <div className="bg-smooth-black pl-gnb-left universe-box-shadow">{children}</div>
      </body>
    </html>
  )
}
