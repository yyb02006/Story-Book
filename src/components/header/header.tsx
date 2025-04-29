'use client'

import SearchForm from '#/components/searchForm'

export default function Header() {
  return (
    <div className="dark:border-dark-border border-light-border pl-gnb-left absolute top-0 left-0 z-[1000] flex w-full justify-center border-b py-4">
      <div className="w-full max-w-[500px]">
        <SearchForm onSearch={() => {}} />
      </div>
    </div>
  )
}
