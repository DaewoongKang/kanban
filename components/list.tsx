import { useState, useEffect } from "react"
import { DragEvent } from "react"
import Card from "./card";
import type {CardType, ListType} from "../components/type"

export default function List(props: {list:ListType, 
        removeList: Function, updateList: Function, moveList: Function, generateCardId: Function, insertCard: Function}) {
    const [title, setTitle] = useState(props.list.title);
    const [cards, setCards] = useState([] as CardType[]);

    useEffect(() => {
        setCards(props.list.cards);
        setTitle(props.list.title);

    }, [props.list]);

    function addCard(cardTitle: string): void {
        const id = props.generateCardId();

        const newCards = [...cards, {id: id, title: cardTitle + id}];
        props.updateList({id:props.list.id, title: title, cards: newCards});
    }
    
    function removeCard(id: number): void {
        const newCards = cards.filter((card) => card.id != id);
        props.updateList({id:props.list.id, title: title, cards: newCards});
    }

    function updateCard(newCard: CardType): void {
        const newCards: CardType[] = [];
        cards.forEach((card) => {
            if (card.id == newCard.id) 
                newCards.push(newCard);
            else
                newCards.push(card);
        });
        props.updateList({id:props.list.id, title: title, cards: newCards});
    }

    function moveCard(x: number, y:number, moveCard: CardType): void {
        const dropPos = findDropPos(x, y);
        if (dropPos == null)
            return;

        const newCards = cards.filter((card) => card.id != moveCard.id);
        props.list.cards = newCards;
        setCards(newCards);

        props.insertCard(moveCard, dropPos.listIndex, dropPos.cardIndex);    
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
            props.moveList(dragIndex, dropIndex); 
    }
    
    return (
        <div className="list" draggable
            onDragEnd={dragEnd}
            onDragOver={e => e.preventDefault()}
        >
            <input value={title} className="title"  onChange={e => {
                props.updateList({id:props.list.id, title: e.target.value, cards: props.list.cards});
            }} />
            <button className="remove" onClick={()=>props.removeList(props.list.id)}>-</button>
            <br/>
            { cards.map((card) => <Card 
                key={card.id} 
                card={card} 
                removeCard={removeCard}
                updateCard={updateCard}
                moveCard={moveCard}
            />) }
            <br/>
            <button className="add" onClick={() => addCard('')}>Add card</button>
        </div>
    )
}