import { useState, useEffect } from "react"
import { DragEvent } from "react"
import Card from "./card";
import type {CardType, ListType} from "../components/type"

export default function List(props: {list:ListType, 
        removeList: Function, orderList: Function, generateCardId: Function, insertCard: Function}) {
    const [title, setTitle] = useState(props.list.title);
    const [cards, setCards] = useState([] as CardType[]);

    useEffect(() => {
        const newCards: CardType[] = [];
        props.list.cards.forEach((card) => newCards.push({id: card.id, title: card.title}));
        setCards(newCards);
        setTitle(props.list.title);

        console.log('list changed', props.list.id);
    }, [props.list]);

    useEffect(() => {
        console.log('card changed', props.list.id);
    }, [title, cards]);

    function addCard(cardTitle: string): void {
        const id = props.generateCardId();

        const newCards = [...cards, {id: id, title: cardTitle + id}];
        setCards(newCards);
        props.list.cards = [...newCards];
    }
    
    function removeCard(id: number): void {
        const newCards = cards.filter((card) => card.id !== id);
        setCards(newCards);
        props.list.cards = [...newCards];
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
                props.list.title = e.target.value;
            }} />
            <button className="remove" onClick={()=>props.removeList(props.list.id)}>-</button>
            <br/>
            { cards.map((item) => <Card 
                key={item.id} 
                card={item} 
                removeCard={removeCard}
                moveCard={moveCard}
            />) }
            <br/>
            <button className="add" onClick={() => addCard('')}>Add card</button>
        </div>
    )
}