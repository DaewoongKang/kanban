import { useState, useEffect } from "react"
import { DragEvent } from "react"
import Card from "./card";

const initItems: {id: number, title: string}[] = [
];
export default function List(props: {id:number, title: string, cards:string[], removeList: Function, orderList: Function, generateCardId: Function}) {
    const [title, setTitle] = useState(props.title);
    const [items, setItems] = useState(initItems);

    useEffect(() => {
        const newItems = [...items];
        props.cards.forEach((card) => newItems.push({id: props.generateCardId(), title: card}));
        setItems(newItems);
    }, [props.cards]);

    function addCard(cardTitle: string): void {
        const id = props.generateCardId();
        setItems([...items, {id: id, title: cardTitle + id}]);
    }
    
    function removeCard(id: number): void {
        const newItems = items.filter((item) => item.id !== id);
        setItems(newItems);
    }

    function moveCard(e: DragEvent<HTMLElement>, id: number): void {
        const dragItem = e.target as HTMLElement;
        const card = Array.from(items).find((item) => item.id === id);

        console.log('moveCard', id, card);
        //const dragListIndex = findListIndex(e.clientX);

        //removeCard(id);
    }

    

    function findListIndex(x: number): number {
        return 0;
    }
    
    
    function dragEnd(e: DragEvent<HTMLDivElement>): void {
        const dragItem = e.target as HTMLElement;
        if (dragItem.className !== 'list')
            return;

        const children = (dragItem.parentNode as HTMLElement).children as HTMLCollectionOf<HTMLElement>;
        const lists = Array.from(children).filter((child) => child.className === 'list');
        const dragIndex = Array.from(lists).indexOf(dragItem);

        let dropIndex = 0; //after item
        while (dropIndex < lists.length) {
            const list = lists[dropIndex];
            const centerX = list.offsetLeft + list.offsetWidth / 2;
            if (e.clientX < centerX) {
                if (dropIndex > dragIndex)
                    dropIndex = dropIndex - 1;
                break
            }
            dropIndex++;
        }

        if (dropIndex == lists.length)
            dropIndex = dropIndex - 1;

        if (dragIndex != dropIndex)
            props.orderList(dragIndex, dropIndex); 
    }
    
    return (
        <div className="list" draggable
            onDragEnd={dragEnd}
            onDragOver={e => e.preventDefault()}
        >
            <input value={title} className="title"  onChange={e => setTitle(e.target.value)} />
            <button className="remove" onClick={()=>props.removeList(props.id)}>-</button>
            <br/>
            { items.map((item) => <Card 
                key={item.id} 
                id={item.id} 
                title={item.title} 
                removeCard={removeCard}
                moveCard={moveCard}
            />) }
            <br/>
            <button className="add" onClick={() => addCard('')}>Add card</button>
        </div>
    )
}