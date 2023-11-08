'use client'

import React, { useRef, useState} from "react"
import List from "../components/list"

let initItems: {id: number, title: string, cards:{id: number, title: string}[]}[] = [
  {id: 0, title: 'left', cards: [{id:0, title:'red'}, {id:1, title:'orange'}]},
  {id: 1, title: 'center', cards: [{id:2, title:'yellow'}, {id:3, title:'green'}]},
  {id: 2, title: 'right', cards: [{id:4, title:'blue'}, {id:5, title:'indigo'}, {id:6, title:'violet'}]}
];

export default function Home() {
  const [id, setId] = useState(initItems.length)
  const [items, setItems] = useState(initItems);
  const [title, setTitle] = useState('');

  const cardId = useRef(6);
  
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
    
    return cardId.current;
  }

  function insertCard(card: {id: number, title: string}, listIndex: number, cardIndex:number): void {
    const list = items[listIndex];
    const newList = {...list};

    newList.cards.splice(cardIndex, 0, card);

    const newItems = [...items];
    newItems.splice(listIndex, 1, newList);
    setItems(newItems);
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