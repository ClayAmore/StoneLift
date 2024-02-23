import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'

interface IUseSearchProps {
  dataSet: any[]
  keys: string[],
  shouldSort: boolean
}

const SCORE_THRESHOLD = 0.4

export default function useSearch({ dataSet, keys, shouldSort = true }: IUseSearchProps) {
  const [searchValue, setSearchValue] = useState('')

  const fuse = useMemo(() => {
    const options = {
      includeScore: true,
      shouldSort,
      keys,
    }

    return new Fuse(dataSet, options)
  }, [dataSet, keys])

  const results = useMemo(() => {
    if (!searchValue) return dataSet

    const searchResults = fuse.search(searchValue)

    return searchResults
      .filter((fuseResult) => {
        if(!fuseResult.score) return false;
        return fuseResult.score < SCORE_THRESHOLD;
    })
      .map((fuseResult) => fuseResult.item)
  }, [fuse, searchValue, dataSet])

  return {
    searchValue,
    setSearchValue,
    results,
  }
}