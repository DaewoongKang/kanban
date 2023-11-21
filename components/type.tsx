export type CardType = {
    id: number, 
    title: string
  };  
  
export type ListType = {
    id: number, 
    title: string, 
    cards:CardType[],
};

export type BoardType = {
    lists: ListType[],
    maxListId: number,
    maxCardId: number
}  