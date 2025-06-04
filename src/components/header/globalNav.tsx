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
      <li className="group flex aspect-square w-full flex-col items-center justify-center space-y-1 stroke-2">
        <div className="dark:group-hover:bg-slate-blue dark:stroke-smooth-white group-hover:bg-bright-blue group-hover:stroke-smooth-white rounded-md stroke-[#707070] p-2">
          {cloneElement(children)}
        </div>
        <div className="dark:text-smooth-white dark:font-S-CoreDream-400 font-S-CoreDream-500 text-xs text-[#606060]">
          {title}
        </div>
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
      className="w-gnb dark:bg-dark-gray bg-light-bg fixed z-[1000] h-screen"
    >
      {/*       {wave.colors.map((color) => (
        <div key={color} className={cls('absolute size-full')} style={{ backgroundColor: color }} />
      ))} */}
      <h1 className="font-patrick-hand dark:text-smooth-white text-midnight-gray relative text-center text-[1.25rem]">
        <Link href="/">MEMOISM</Link>
      </h1>
      <div className="relative mt-2 w-full p-4">
        <div className="bg-bright-blue flex aspect-square w-full items-center justify-center rounded-xl font-[#eaeaea]">
          most
        </div>
        <div className="dark:border-t-smooth-white m-auto mt-2 size-0 border-x-[6px] border-t-[6px] border-x-transparent border-t-[#707070]"></div>
        <div className="dakr:border-[#999999] m-auto mt-2 w-3/4 rounded-full border-b border-[#707070]"></div>
      </div>
      <ul className="font-S-CoreDream-400 relative flex h-auto flex-col items-center space-y-6 text-sm">
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
