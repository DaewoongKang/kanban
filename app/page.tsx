'use client'

import React, { useRef, useState } from "react"
import List from "../components/list"

let initItems: {id: number, title: string, cards:string[]}[] = [
  {id: 0, title: 'left', cards: ['red', 'orange']},
  {id: 1, title: 'center', cards: ['yellow', 'green']},
  {id: 2, title: 'right', cards: ['blue', 'indigo', 'violet']}
];

export default function Home() {
  const [id, setId] = useState(initItems.length)
  const [items, setItems] = useState(initItems);
  const [title, setTitle] = useState('');

  const cardId = useRef(0);

  function addList() {
    setId(id + 1);
    setItems([...items, {id: id, title: title, cards:[]}]);
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
    cardId.current = cardId.current + 1;
console.log('generateCardId', cardId.current);    
    return cardId.current;
  }

  return (
      <div className="kanban">
        { items.map((item) => <List 
          key={item.id}
          title={item.title}
          id={item.id}
          cards={item.cards}
          removeList={removeList}
          orderList={orderList}
          generateCardId={generateCardId}
        />) }
        <div className="adder">
          <input name="title" value={title} onChange={e => setTitle(e.target.value)} />
          <br/>
          <button className="add" onClick={addList}>Add List</button>
        </div>
      </div>
  )
}