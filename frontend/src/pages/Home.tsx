import React, { useState, useEffect } from "react";
import { Pane, SearchInput, Heading, majorScale, Button, Dialog, Paragraph, Text, Link } from 'evergreen-ui'
import Data from "../data/human-condition.json"
import Highlighter from "react-highlight-words";
import Fuse from "fuse.js"
import "./Home.css"
import HannahArendtImage from "../static/hannah-arendt.jpg"

interface Reference {
  text: string
  pageNumber: number
  chapter: string
  section: string
}

type SearchResult = Fuse.FuseResult<Reference>

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
    doSearch(query)
  }

  const doSearch = (q: string) => {
    if (!hasSearched) setHasSearched(true)
    const finalQuery = q.trim().split(" ").map(s => `'" ${s} "`).join(" ")
    setResults(fuse.search<Reference>(finalQuery))
  }

  const onDialogClose = () => {
    setSelected(undefined)
    setModalShown(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleSearchQuery = (q: string) => {
    setQuery(q)
    doSearch(q)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) handleSubmit()
  }

  let selectedText = ""
  if (selected) {
    selectedText = Data.slice(selected.refIndex - 2, selected.refIndex + 4).map(d => d.text).join(" ")
  }

  return (
    <Pane display="flex" flexDirection="column">
      <Dialog hasFooter={false} hasHeader={false} isShown={modalShown} onCloseComplete={onDialogClose}>
        {selected &&
          <Highlighter searchWords={[selected.item.text]} textToHighlight={selectedText} />}
      </Dialog>

      {/** Header **/}
      <Pane height="300px" display="flex" background="#CCC" marginBottom={majorScale(2)}>
        <Pane margin="auto" display="flex" flexDirection="column" width="500px" alignItems="center">
          <Pane border display="flex" marginBottom={majorScale(2)}>
            <Pane>
              <img width={"100px"} src={HannahArendtImage} />
            </Pane>
            <Pane marginLeft={majorScale(2)} display="flex" flexDirection={"column"} justifyContent="center">
              <Heading margin={0} padding={0} size={900}>Hannah Arendt Index</Heading>
              <Paragraph marginTop={majorScale(1)}>This tool allows you to search the entire work of Hannah Arendt's "The Human Condition". Use whitespace for multi-keyword searches.</Paragraph>
            </Pane>
          </Pane>

          <Pane display="flex" alignItems="center" marginBottom={majorScale(2)}>
            <SearchInput onKeyDown={handleKeyDown} height={40} placeholder="Search" onChange={handleChange} value={query} />
            <Button onClick={handleSubmit} height={40} marginLeft={majorScale(1)}>Search</Button>
          </Pane>
          <Pane>
            <Text>Suggested Searches: </Text>
            <Link className="Clickable" marginRight={majorScale(1)} onClick={() => handleSearchQuery("human condition")}>human condition</Link>
            <Link className="Clickable" marginRight={majorScale(1)} onClick={() => handleSearchQuery("vita activa")}>vita activa</Link>
            <Link className="Clickable" marginRight={majorScale(1)} onClick={() => handleSearchQuery("labor")}>labor</Link>
          </Pane>
        </Pane>
      </Pane>

      {/** Body **/}

      <Pane display="flex" flexDirection="column" alignItems="center">
        {!hasSearched && <Pane>
          <Heading size={600} padding={majorScale(3)}>Use the above search to query Hannah Arendt's <i>The Human Condition</i></Heading>
        </Pane>
        }
        {hasSearched && results.length === 0 && <Pane>
          <Heading size={600} padding={majorScale(3)}>No Results Found</Heading>
        </Pane>
        }
        {hasSearched && results.length > 0 && <Pane width={majorScale(64)} display="flex" justifyContent="flex-end">
          Number of Results: {results.length}
        </Pane>
        }
        {results.map((r, i) => (
          <Pane elevation={0} hoverElevation={1} width={majorScale(64)} margin={majorScale(2)} key={`${r.refIndex}${i}`} onClick={() => setSelected(r)} className="Clickable">
            <Pane>
              <Pane borderBottom display="flex" justifyContent="space-between" paddingLeft={majorScale(2)} paddingRight={majorScale(2)}>
                <Text>Page Number: {r.item.pageNumber}</Text> <Text>{r.item.chapter}</Text>
              </Pane>
              <Pane padding={majorScale(2)}>
                <Highlighter searchWords={queries} textToHighlight={r.item.text} />
              </Pane>
            </Pane>
          </Pane>
        ))}
      </Pane>
    </Pane >
  )
}
