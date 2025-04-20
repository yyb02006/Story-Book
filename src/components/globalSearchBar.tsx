'use client'

import SearchForm from '#/components/searchForm'

export default function GlobalSearchBar() {
  return (
    <div className="absolute left-0 top-0 z-[1000] flex w-full justify-center border-b border-midnight-gray py-4">
      <SearchForm onSearch={() => {}} />
    </div>
  )
}
