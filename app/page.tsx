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

  useEffect(() =>  {
    if (lists.length == 0)
      return;

    console.log('fetch post', lists, maxListId.current, maxCardId.current)  

    fetch('api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({lists: lists, maxListId: maxListId.current, maxCardId: maxCardId.current}),
    });  
  },[lists]);

  useEffect(() =>  {
    const source = new EventSource('/api?sse');
    source.onmessage = function(event) {
      console.log('sse client', event.data);
    };
  },[]);

  
  function addList() {
    setLists([...lists, {id: ++maxListId.current, title: title, cards:[]}]);
    setTitle('');
  }
  
  function removeList(id: number) {
    const newLists = lists.filter((list) => list.id !== id);
    setLists(newLists);
  }

  function orderList(from: number, to: number) {
    const newLists = lists.slice();
    const list = newLists.splice(from, 1)[0];
    newLists.splice(to, 0, list);
    setLists(newLists);
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
    setLists(newLists);

    console.log('insertCard', newLists)
  }

  return (
      <div className="kanban">
        { lists.map((list) => <List 
          key={list.id}
          list = {list}
          removeList={removeList}
          orderList={orderList}
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