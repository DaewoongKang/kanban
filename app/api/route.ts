import { NextResponse } from 'next/server'
import fsPromises from 'fs';
import path from 'path'

export const dynamic = 'force-dynamic'

const encoder = new TextEncoder();
let sse: WritableStreamDefaultWriter<any>[] = [];

function getJsonPath(): string {
    return path.join(process.cwd(), 'json/kanban.json');
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    if (searchParams.has('sse')) {
        const stream = new TransformStream()
        sse.push(stream.writable.getWriter())
    
        return new NextResponse(stream.readable, {
            headers: {
              "Content-Type": "text/event-stream",
              "Connection": "keep-alive",
              "Cache-Control": "no-cache",
            }
          });
    } else {
        const json = fsPromises.readFileSync(getJsonPath());

        return new NextResponse(json)
    }    
}

export async function POST(request: Request) {
    const json = await request.text();
    fsPromises.writeFileSync(getJsonPath(), json);

    let data = encoder.encode(`data: ${json}\n\n`);
    for (let i = 0; i < sse.length; i++) {
        const writer = sse[i];
        writer.ready.then(() => {
            writer.write(data);
        }).catch(_ => { // client disconnected
            sse.splice(i, 1);
        });
    }

    return new NextResponse('ok')
}