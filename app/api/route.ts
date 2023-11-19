import { NextResponse } from 'next/server'
import fsPromises from 'fs';
import path from 'path'

export const dynamic = 'force-dynamic'

function getJsonPath(): string {
    return path.join(process.cwd(), 'json/kanban.json');
}

let writer: WritableStreamDefaultWriter<any> | null = null;
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    if (searchParams.has('sse')) {
        const stream = new TransformStream()
        writer = stream.writable.getWriter()    
    
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
    fsPromises.writeFileSync(getJsonPath(), JSON.stringify(await request.json()));

    console.log('POST')
    if (writer) {
        const encoder = new TextEncoder();
        writer.write(encoder.encode('data: reload\n\n'));
    }
    return new NextResponse('ok')
}