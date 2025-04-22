'use client'

import SearchForm from '#/components/searchForm'

export default function Header() {
  return (
    <div className="absolute left-0 top-0 z-[1000] flex w-full justify-center border-b border-midnight-gray py-4 pl-gnb-left">
      <div className="w-full max-w-[500px]">
        <SearchForm onSearch={() => {}} />
      </div>
    </div>
  )
}
