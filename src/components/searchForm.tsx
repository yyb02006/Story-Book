import { SyntheticEvent, useState } from 'react'
import { Search } from '../../public/icons/ui'
import { TextInput } from '#/components/Inputs'

interface SearchFormProps {
  onSearch: (e: SyntheticEvent<HTMLFormElement>) => void
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [searchWord, setSearchWord] = useState('')
  return (
    <form onSubmit={onSearch} className="flex h-14 w-full space-x-2">
      <div className="flex w-full rounded-full bg-dark-gray ring-1 ring-gray">
        <button className="flex items-center p-2">
          <div className="mr-1 flex aspect-square h-full items-center justify-center rounded-full border border-gray">
            <Search width={20} height={20} strokeColor="#eaeaea" strokeWidth={3} />
          </div>
          <div className="flex items-center">
            <div className="mt-[2px] border-4 border-transparent border-t-smooth-white"></div>
          </div>
        </button>
        <TextInput
          name="search"
          placeholder="search"
          className="rounded-r-full border-none bg-transparent px-2 placeholder:font-bold"
          onChange={(value) => {
            setSearchWord(value)
          }}
          value={searchWord}
        />
      </div>
      <button type="submit" className="flex aspect-square items-center justify-center p-1">
        <div className="flex aspect-square h-full items-center justify-center rounded-full bg-bright-blue">
          <Search width={24} height={24} strokeColor="#eaeaea" strokeWidth={2} />
        </div>
      </button>
    </form>
  )
}
