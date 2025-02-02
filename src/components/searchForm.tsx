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
          <div className="mr-1 flex aspect-square h-full items-center justify-center rounded-full border border-[#707070]">
            <Search width={20} height={20} strokeColor="#eaeaea" strokeWidth={3} />
          </div>
          <div className="flex items-center">
            <div className="mt-[2px] border-4 border-transparent border-t-smooth-white"></div>
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
          <Search width={24} height={24} strokeColor="#eaeaea" strokeWidth={2} />
        </div>
      </button>
    </form>
  )
}
