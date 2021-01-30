import React, { useState, useEffect } from "react";
import { Pane, SearchInput, Heading, majorScale, Button, Dialog, Paragraph } from 'evergreen-ui'
import Data from "../data/human-condition.json"
import Highlighter from "react-highlight-words";
import Fuse from "fuse.js"
import "./Home.css"
import HannahArendtImage from "../static/hannah-arendt.jpg"

type SearchResult = Fuse.FuseResult<"">

export default () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [selected, setSelected] = useState<SearchResult | undefined>(undefined)
  const [modalShown, setModalShown] = useState<boolean>(false)
  const [hasSearched, setHasSearched] = useState<boolean>(false)

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

  const handleSubmit = () => {
    const finalQuery = query.trim().split(" ").map(s => `'${s}`).join(" ")
    if (!hasSearched) setHasSearched(true)
    setResults(fuse.search<"">(finalQuery))
  }

  const onDialogClose = () => {
    setSelected(undefined)
    setModalShown(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) handleSubmit()
  }

  let selectedText = ""
  if (selected) {
    selectedText = Data.slice(selected.refIndex - 2, selected.refIndex + 2).join("")
  }

  return (
    <Pane display="flex" flexDirection="column">
      <Dialog hasFooter={false} hasHeader={false} isShown={modalShown} onCloseComplete={onDialogClose}>
        {selected &&
          <Highlighter searchWords={[selected.item]} textToHighlight={selectedText} />}
      </Dialog>

      {/** Header **/}
      <Pane height="300px" display="flex" background="#CCC" marginBottom={majorScale(2)}>
        <Pane margin="auto" display="flex" flexDirection="column" width="500px" alignItems="center">
          <Pane border display="flex" marginBottom={majorScale(3)}>
            <Pane>
              <img width={"100px"} src={HannahArendtImage} />
            </Pane>
            <Pane marginLeft={majorScale(2)} display="flex" flexDirection={"column"}>
              <Heading margin={0} padding={0} size={900}>Hannah Arendt Index</Heading>
              <Paragraph>This tool allows you to search the entire work of Hannah Arendt's "The Human Condition". Use whitespace for multi-keyword searches.</Paragraph>
            </Pane>
          </Pane>
          <Pane display="flex" alignItems="center">
            <SearchInput onKeyDown={handleKeyDown} height={40} placeholder="Search" onChange={handleChange} value={query} />
            <Button onClick={handleSubmit} height={40} marginLeft={majorScale(1)}>Search</Button>
          </Pane>
        </Pane>
      </Pane>

      {/** Body **/}

      <Pane display="flex" flexDirection="column" alignItems="center">
        {hasSearched && <Pane width={majorScale(64)} display="flex" justifyContent="flex-end">
          Number of Results: {results.length}
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
    </Pane >
  )
}
