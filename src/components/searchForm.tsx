import Input from '#/components/input'
import { SetStateAction, SyntheticEvent } from 'react'

interface SearchFormProps {
  onSearch: (e: SyntheticEvent<HTMLFormElement>) => void
  setSearchWord: (value: SetStateAction<string>) => void
  searchWord: string
  w?: number
}

export default function SearchForm({
  onSearch,
  setSearchWord,
  searchWord,
  w = 500,
}: SearchFormProps) {
  return (
    <form onSubmit={onSearch} className="flex h-10 space-x-2">
      <div className="flex rounded-full bg-red-500" style={{ width: w }}>
        <div className="aspect-square rounded-s-full bg-amber-500"></div>
        <Input
          name="search"
          type="text"
          placeholder="search"
          css="border-none placeholder:font-bold bg-transparent px-2 rounded-full"
          onChange={(e: SyntheticEvent<HTMLInputElement>) => {
            setSearchWord(e.currentTarget.value)
          }}
          value={searchWord}
        />
      </div>
      <button
        type="submit"
        className="flex aspect-square h-full items-center justify-center rounded-full bg-pink-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>
    </form>
  )
}
