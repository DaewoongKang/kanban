import fsPromises from 'fs';
import path from 'path'

export async function read() {
  const filePath = path.join(process.cwd(), 'json/kanban.json');
  const jsonData = await fsPromises.readFile(filePath);
  const json = JSON.parse(jsonData);

  return json
}