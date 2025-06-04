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
      <div className="dark:border-dark-border border-light-border dark:bg-smooth-black bg-light-bg flex w-full rounded-full border">
        <button className="flex items-center p-2">
          <div className="dark:border-dark-border dark:bg-dark-bg bg-white-gray border-light-border mr-1 flex aspect-square h-full items-center justify-center rounded-full border">
            <Search width={20} height={20} strokeColor="#eaeaea" strokeWidth={3} />
          </div>
          <div className="flex items-center">
            <div className="border-t-dark-disabled-icon mt-[2px] border-4 border-transparent" />
          </div>
        </button>
        <TextInput
          name="search"
          placeholder="search"
          className="dark:placeholder-dark-placeholder rounded-r-full border-none bg-transparent px-2 placeholder-[#606060] placeholder:font-bold"
          onChange={(value) => {
            setSearchWord(value)
          }}
          value={searchWord}
        />
      </div>
      <button type="submit" className="flex aspect-square items-center justify-center p-1">
        <div className="bg-bright-blue flex aspect-square h-full items-center justify-center rounded-full">
          <Search width={24} height={24} strokeColor="#eaeaea" strokeWidth={2} />
        </div>
      </button>
    </form>
  )
}
