import { useState } from "react"
import { DragEvent } from "react"

export default function Card(props: {id:number, title:string, removeCard: Function, moveCard: Function}) {
    const [title, setTitle] = useState(props.title);

    function dragEnd(e: DragEvent<HTMLElement>): void {
        props.moveCard(e, props.id);

        return;


        const dragItem = e.target as HTMLElement;

        const children = (dragItem.parentNode as HTMLElement).children as HTMLCollectionOf<HTMLElement>;
        const cards = Array.from(children).filter((child) => child.className === 'card');
        const dragIndex = Array.from(cards).indexOf(dragItem);
        let dropIndex = 0; //after item
        while (dropIndex < cards.length) {
            const card = cards[dropIndex];
            const centerY = card.offsetTop + card.offsetHeight / 2;
            if (e.clientY < centerY) {
                if (dropIndex > dragIndex)
                    dropIndex = dropIndex - 1;
                break
            }
            dropIndex++;
        }

        if (dropIndex == cards.length)
            dropIndex = dropIndex - 1;

        if (dragIndex != dropIndex)
            props.moveCard(dragIndex, dropIndex); 
    }

    return (
        <div className="card" draggable
            onDragEnd={dragEnd}
        >
            <textarea value={title} onChange={e => setTitle(e.target.value)} />
            <button className="remove" onClick={()=>props.removeCard(props.id)}>-</button>
        </div>
    )
}