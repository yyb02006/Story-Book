import Input from '#/components/input'
import { SetStateAction, SyntheticEvent } from 'react'
import { Search } from '../../public/icons/ui'

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
    <form onSubmit={onSearch} className="flex h-14 space-x-2">
      <div className="flex rounded-full bg-[#202020] ring-1 ring-[#707070]" style={{ width: w }}>
        <button className="flex items-center p-2">
          <div className="mr-1 flex aspect-square h-full items-center justify-center rounded-full bg-sky-400">
            <Search width={20} height={20} strokeColor="#eaeaea" strokeWidth={3} />
          </div>
          <div className="flex items-center">
            <div className="mt-[2px] border-4 border-transparent border-t-purple-300"></div>
          </div>
        </button>
        <Input
          name="search"
          type="search"
          placeholder="search"
          css="border-none placeholder:font-bold bg-transparent px-2 rounded-r-full"
          onChange={(e: SyntheticEvent<HTMLInputElement>) => {
            setSearchWord(e.currentTarget.value)
          }}
          value={searchWord}
        />
      </div>
      <button type="submit" className="flex aspect-square items-center justify-center p-1">
        <div className="flex aspect-square h-full items-center justify-center rounded-full bg-[#516afc]">
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
        </div>
      </button>
    </form>
  )
}
