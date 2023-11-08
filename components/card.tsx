import { useState } from "react"
import { DragEvent } from "react"

export default function Card(props: {item: {id: number, title: string} , removeCard: Function, moveCard: Function}) {
    const [title, setTitle] = useState(props.item.title);

    function dragEnd(e: DragEvent<HTMLElement>): void {
        props.moveCard(e.clientX, e.clientY, props.item);
    }

    return (
        <div className="card" draggable
            onDragEnd={dragEnd}
        >
            <textarea value={title} onChange={e => setTitle(e.target.value)} />
            <button className="remove" onClick={()=>props.removeCard(props.item.id)}>-</button>
        </div>
    )
}