'use client'

import SearchForm from '#/components/searchForm'
import { SyntheticEvent } from 'react'

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex w-full justify-center py-4">
        <SearchForm
          onSearch={(e: SyntheticEvent<HTMLFormElement>) => {
            e.preventDefault()
          }}
          setSearchWord={() => {}}
          searchWord=""
        />
      </div>
      <div className="size-full">notes section</div>
    </div>
  )
}
