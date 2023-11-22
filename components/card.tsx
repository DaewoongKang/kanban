import { useEffect, useState } from "react"
import { DragEvent } from "react"
import type {CardType} from "../components/type"

export default function Card(props: {card: CardType , removeCard: Function, updateCard: Function, moveCard: Function}) {
    const [title, setTitle] = useState(props.card.title);
    useEffect(() => {
        setTitle(props.card.title);
    }, [props.card]);    

    function dragEnd(e: DragEvent<HTMLElement>): void {
        props.moveCard(e.clientX, e.clientY, props.card);
    }

    return (
        <div className="card" draggable
            onDragEnd={dragEnd}
        >
            <textarea value={title} onChange={e => props.updateCard({id:props.card.id, title:e.target.value})} />
            <button className="remove" onClick={()=>props.removeCard(props.card.id)}>-</button>
        </div>
    )
}