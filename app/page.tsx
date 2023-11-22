'use client'

import React, { useRef, useState, useEffect} from "react"
import List from "../components/list"
import type {CardType, ListType, BoardType} from "../components/type"


export default function Home() {
  const [lists, setLists] = useState([] as ListType[]);
  const [title, setTitle] = useState('');
  const maxCardId = useRef(0);
  const maxListId = useRef(0);


  useEffect(() =>  {
    fetch('api/').then(res => res.json()).then((json:BoardType) => {
      setLists(json.lists)
      maxListId.current = json.maxListId
      maxCardId.current = json.maxCardId
    })
  },[]);

  function save(newLists: ListType[]) {
    if (lists.length == 0)
      return;

    console.log('fetch post', newLists, maxListId.current, maxCardId.current)  

    fetch('api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({lists: newLists, maxListId: maxListId.current, maxCardId: maxCardId.current}),
    });  
  };

  useEffect(() =>  {
    const source = new EventSource('/api?sse');
    source.onmessage = function(event) {
      const board: BoardType = JSON.parse(event.data);
      
      setLists(board.lists);
      maxListId.current = board.maxListId;
      maxCardId.current = board.maxCardId;

    };
  },[]);

  
  function addList() {
    const newLists = [...lists, {id: ++maxListId.current, title: title, cards:[]}];
    setTitle('');
    save(newLists);
  }
  
  function removeList(id: number) {
    const newLists = lists.filter((list) => list.id !== id);
    save(newLists);
  }

  function updateList(list: ListType) {
    const newLists: ListType[] = [];
    lists.forEach((l) => {
      if (l.id === list.id) 
        newLists.push(list);
      else
        newLists.push(l);
    });
    save(newLists);
  }

  function moveList(from: number, to: number) {
    const newLists = lists.slice();
    const list = newLists.splice(from, 1)[0];
    newLists.splice(to, 0, list);
    save(newLists);
  }

  function generateCardId(): number {
    return ++maxCardId.current;
  }

  function insertCard(card: CardType, listIndex: number, cardIndex:number): void {
    const list = lists[listIndex];
    const newList = {...list};

    newList.cards.splice(cardIndex, 0, card);

    const newLists = [...lists];
    newLists.splice(listIndex, 1, newList);
    save(newLists);
  }

  return (
      <div className="kanban">
        { lists.map((list) => <List 
          key={list.id}
          list = {list}
          removeList={removeList}
          updateList={updateList}
          moveList={moveList}
          generateCardId={generateCardId}
          insertCard={insertCard}
        />) }
        <div className="adder">
          <input name="title" value={title} onChange={e => setTitle(e.target.value)} />
          <br/>
          <button className="add" onClick={addList}>Add List</button>
        </div>
      </div>
  )
}