import React, { useState, useEffect } from "react";
import { Pane, SearchInput, Heading, majorScale, Button, Dialog } from 'evergreen-ui'
import Data from "../data/human-condition.json"
import Highlighter from "react-highlight-words";
import Fuse from "fuse.js"
import "./Home.css"

type SearchResult = Fuse.FuseResult<"">

export default () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [selected, setSelected] = useState<SearchResult | undefined>(undefined)
  const [modalShown, setModalShown] = useState<boolean>(false)

  const options = {
    shouldSort: false,
    useExtendedSearch: true,
    keys: ['text']
  }
  const fuse = new Fuse(Data, options)
  const queries = query.trim().split(" ")

  useEffect(() => {
    if (selected === undefined) return
    setModalShown(true)
  }, [selected])

  /* useEffect(() => {
   *   setResults(fuse.search<Reference>("'freedom"))
   * }, []) */

  const handleSubmit = () => {
    const finalQuery = query.trim().split(" ").map(s => `'${s}`).join(" ")
    console.log(finalQuery)
    setResults(fuse.search<"">(finalQuery))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) handleSubmit()
  }

  let selectedText = ""
  if (selected) {
    selectedText = Data.slice(selected.refIndex - 2, selected.refIndex + 2).join(". ")
  }

  return (
    <Pane display="flex" flexDirection="column">
      <Dialog hasFooter={false} hasHeader={false} isShown={modalShown} onCloseComplete={() => setModalShown(false)}>
        {selected &&
          <Highlighter searchWords={[selected.item]} textToHighlight={selectedText} />}
      </Dialog>

      {/** Header **/}
      <Pane height="300px" display="flex" background="gray" marginBottom={majorScale(2)}>
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
        {results.length > 0 && <Pane width={majorScale(64)} display="flex" justifyContent="flex-end">
          Results: {results.length}
        </Pane>
        }
        {results.map((r, i) => (
          <Pane elevation={0} hoverElevation={1} width={majorScale(64)} margin={majorScale(2)} key={`${r.refIndex}${i}`} onClick={() => setSelected(r)} className="Clickable">
            <Pane padding={majorScale(2)}>
              <Highlighter searchWords={queries} textToHighlight={r.item} />
            </Pane>
          </Pane>
        ))}
      </Pane>
    </Pane>
  )
}
