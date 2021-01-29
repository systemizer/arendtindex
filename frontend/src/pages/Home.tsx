import React, { useState, useEffect } from "react";
import { Pane, SearchInput, Heading, majorScale, Button } from 'evergreen-ui'
import Data from "../data/human-condition.json"
import Highlighter from "react-highlight-words";
import Fuse from "fuse.js"

interface Reference {
  text: string
  page: number
}

type SearchResult = Fuse.FuseResult<Reference>[]

export default () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult>([])

  const options = {
    includeScore: true,
    shouldSort: true,
    useExtendedSearch: true,
    keys: ['text']
  }
  const fuse = new Fuse(Data, options)

  /* useEffect(() => {
   *   setResults(fuse.search<Reference>("'freedom"))
   * }, []) */

  const handleSubmit = () => {
    setResults(fuse.search<Reference>(`'${query}`))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) handleSubmit()
  }

  return (
    <Pane display="flex" flexDirection="column">

      {/** Header **/}
      <Pane height="300px" display="flex" background="gray">
        <Pane margin="auto" display="flex" flexDirection="column" minWidth="500px" alignItems="center">
          <Heading size={900} padding={majorScale(3)}>Hannah Arendt Index</Heading>
          <Pane display="flex" alignItems="center">
            <SearchInput onKeyDown={handleKeyDown} height={40} placeholder="Search" onChange={handleChange} value={query} />
            <Button onClick={handleSubmit} height={40} marginLeft={majorScale(1)}>Search</Button>
          </Pane>
        </Pane>
      </Pane>

      {/** Body **/}
      <Pane display="flex" flexDirection="column" alignItems="center">
        {results.map((r, i) => (
          <Pane elevation={0} width={majorScale(64)} margin={majorScale(2)} key={`${r.item.page}${i}`}>
            <Pane height={majorScale(4)} borderBottom display="flex" alignItems="center" >
              <Pane marginLeft={majorScale(1)}>
                <b>Page:</b> {r.item.page}
              </Pane>
            </Pane>
            <Pane padding={majorScale(2)}>
              <Highlighter searchWords={[query]} textToHighlight={r.item.text} />
            </Pane>
          </Pane>
        ))}
      </Pane>
    </Pane>
  )
}
