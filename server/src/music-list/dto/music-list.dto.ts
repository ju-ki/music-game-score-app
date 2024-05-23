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

export class addMusicToListType {
  musicListId: string;
  musicGenreId: number;
  userId: string;
  selectedMusic: number[];
}
