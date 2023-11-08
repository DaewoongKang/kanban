import { useState, useEffect } from "react"
import { DragEvent } from "react"
import Card from "./card";

const initItems: {id: number, title: string}[] = [
];
export default function List(props: {item:{id: number, title: string, cards:{id: number, title: string}[]}, 
        removeList: Function, orderList: Function, generateCardId: Function, insertCard: Function}) {
    const [title, setTitle] = useState(props.item.title);
    const [items, setItems] = useState(initItems);

    useEffect(() => {
        const newItems = [...initItems];
        props.item.cards.forEach((card) => newItems.push({id: card.id, title: card.title}));
        setItems(newItems);
    }, [props.item]);

    function addCard(cardTitle: string): void {
        const id = props.generateCardId();

        const newItems = [...items, {id: id, title: cardTitle + id}];
        setItems(newItems);
        props.item.cards = [...newItems];
    }
    
    function removeCard(id: number): void {
        const newItems = items.filter((item) => item.id !== id);
        setItems(newItems);
        props.item.cards = [...newItems];
    }

    function moveCard(x: number, y:number, card: {id: number, title: string}): void {
        const dropPos = findDropPos(x, y);
        if (dropPos == null)
            return;

        removeCard(card.id);
        props.insertCard(card, dropPos.listIndex, dropPos.cardIndex);    
    }

    type Nullable<T> = T | null;

    function findDropPos(x: number, y: number): Nullable<{ listIndex:number, cardIndex: number}>  {
        const lists  = document.getElementsByClassName("list")  as HTMLCollectionOf<HTMLElement>;
        
        for (let i = 0; i < lists.length; i++) {
            const list = lists[i];
            if (x >= list.offsetLeft && x <= list.offsetLeft + list.offsetWidth) {
                return {listIndex: i, cardIndex: findCardPos(list, y)};
            }
        }

        return null;
    }

    function findCardPos(list: HTMLElement, y: number): number {
        const cards = list.getElementsByClassName("card")  as HTMLCollectionOf<HTMLElement>;
        let i = 0; //after item
        while (i < cards.length) {
            const card = cards[i];
            const centerY = card.offsetTop + card.offsetHeight / 2;
            if (y < centerY) {
                return i;
            }
            i++;
        }

        return i;
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
            <input value={title} className="title"  onChange={e => {
                setTitle(e.target.value);
                props.item.title = e.target.value;
            }} />
            <button className="remove" onClick={()=>props.removeList(props.item.id)}>-</button>
            <br/>
            { items.map((item) => <Card 
                key={item.id} 
                item={item} 
                removeCard={removeCard}
                moveCard={moveCard}
            />) }
            <br/>
            <button className="add" onClick={() => addCard('')}>Add card</button>
        </div>
    )
}