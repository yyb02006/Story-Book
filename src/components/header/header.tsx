'use client'

import SearchForm from '#/components/searchForm'
import Link from 'next/link'

export default function Header() {
  return (
    <div className="dark:bg-smooth-black bg-smooth-white dark:border-dark-border border-light-border pl-gnb-left absolute top-0 left-0 z-[1000] flex w-full justify-center border-b px-4 py-2">
      <div className="w-full max-w-[500px]">
        <SearchForm onSearch={() => {}} />
      </div>
      <div className="font-S-CoreDream-500 absolute top-0 right-0 flex h-full items-center justify-center py-3 pr-4">
        <Link
          className="bg-bright-blue flex h-full items-center justify-center rounded-full px-4 text-sm"
          href="/login"
        >
          Log In
        </Link>
      </div>
    </div>
  )
}
