'use client'

import React, { useRef, useState, useEffect} from "react"
import List from "../components/list"

type CardType = {
  id: number, 
  title: string
};  

type ListType = {
  id: number, 
  title: string, 
  cards:CardType[],
};

type BoardType = {
  lists: ListType[],
  maxListId: number,
  maxCardId: number
}


export default function Home() {
  const [items, setItems] = useState([] as ListType[]);
  const [title, setTitle] = useState('');
  const maxCardId = useRef(0);
  const maxListId = useRef(0);


  useEffect(() =>  {
    fetch('api/').then(res => res.json()).then((json:BoardType) => {
      setItems(json.lists)
      maxListId.current = json.maxListId
      maxCardId.current = json.maxCardId
    })
  },[]);

  useEffect(() =>  {
    if (items.length == 0)
      return;

    console.log('fetch post', items, maxListId.current, maxCardId.current)  

    fetch('api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({lists: items, maxListId: maxListId.current, maxCardId: maxCardId.current}),
    });  
  },[items]);

  useEffect(() =>  {
    const source = new EventSource('/api?sse');
    source.onmessage = function(event) {
      console.log('sse client', event.data);
    };
  },[]);

  
  function addList() {
    setItems([...items, {id: ++maxListId.current, title: title, cards:[]}]);
    setTitle('');
  }
  
  function removeList(id: number) {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
  }

  function orderList(from: number, to: number) {
    const newItems = items.slice();
    const item = newItems.splice(from, 1)[0];
    newItems.splice(to, 0, item);
    setItems(newItems);
  }

  function generateCardId(): number {
    return ++maxCardId.current;
  }

  function insertCard(card: {id: number, title: string}, listIndex: number, cardIndex:number): void {
    const list = items[listIndex];
    const newList = {...list};

    newList.cards.splice(cardIndex, 0, card);

    const newItems = [...items];
    newItems.splice(listIndex, 1, newList);
    setItems(newItems);

    console.log('insertCard', newItems)
  }

  return (
      <div className="kanban">
        { items.map((item) => <List 
          key={item.id}
          item = {item}
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