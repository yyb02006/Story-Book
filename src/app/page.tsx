'use client'

import SearchForm from '#/components/searchForm'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex w-full justify-center">
        <SearchForm onSearch={() => {}} setSearchWord={() => {}} searchWord="" />
        <Link href="/story">나만의 이야기 만들기</Link>
      </div>
      <div className="size-full bg-orange-400">notes</div>
    </div>
  )
}
