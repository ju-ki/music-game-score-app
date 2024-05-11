export class postMusicListType {
  userId: string;
  myListName: string;
  selectedMusic: number[];
  genreId: number;
}

export class getMyListDetailType {
  userId: string;
  genreId: number;
  myListId: string;
}
