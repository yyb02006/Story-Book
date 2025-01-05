'use client'

import { WaveWithInitAnim } from '#/components/waveCanvas'
import { motion } from 'framer-motion'
import { BookMark, Calendar, Chat, CreateMemo, Search } from '../../../public/icons/ui'
import { cloneElement } from 'react'
import Link from 'next/link'
import { globalNavWaves } from '#/libs/client/constants'

const MenuLink = ({
  children,
  title,
  href,
}: {
  children: JSX.Element
  title: string
  href: string
}) => {
  return (
    <Link href={href}>
      <li className="group flex aspect-square w-full flex-col items-center justify-center space-y-1 stroke-smooth-white stroke-2">
        <div className="rounded-md p-2 group-hover:bg-[#474e79]">{cloneElement(children)}</div>
        <div className="text-xs">{title}</div>
      </li>
    </Link>
  )
}

export default function GlobalNav() {
  const linkList = [
    { icon: <Search width={24} height={24} />, title: '검색', href: '/search' },
    { icon: <CreateMemo width={24} height={24} />, title: '새 메모', href: '/write' },
    { icon: <BookMark width={24} height={24} />, title: '관심 메모', href: '/search' },
    { icon: <Calendar width={24} height={24} />, title: '캘린더', href: '/search' },
    { icon: <Chat width={24} height={24} />, title: '대화하기', href: '/search' },
  ]
  return (
    <motion.nav
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ ease: 'easeOut', duration: 0.2 }}
      className="fixed z-[1000] h-screen w-gnb bg-[#202020]"
    >
      {/*       {wave.colors.map((color) => (
        <div key={color} className={cls('absolute size-full')} style={{ backgroundColor: color }} />
      ))} */}
      <h1 className="relative text-center font-patrick-hand text-[1.25rem]">
        <Link href="/">MEMOISM</Link>
      </h1>
      <div className="relative mt-2 w-full p-4">
        <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-[#516afc] font-[#eaeaea]">
          most
        </div>
        <div className="m-auto mt-2 size-0 border-x-[6px] border-t-[6px] border-x-transparent border-t-smooth-white"></div>
        <div className="m-auto mt-2 w-3/4 rounded-full border-b border-[#999999]"></div>
      </div>
      <ul className="relative flex h-auto flex-col items-center space-y-6 font-S-CoreDream-400 text-sm">
        {linkList.map(({ icon, title, href }) => (
          <MenuLink key={title} title={title} href={href}>
            {icon}
          </MenuLink>
        ))}
      </ul>
      <WaveWithInitAnim {...globalNavWaves} />
    </motion.nav>
  )
}
