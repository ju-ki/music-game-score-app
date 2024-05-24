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

export class TagType {
  id: number;
  musicId: number;
  tagName: string;
}

export class MetaMusicType {
  id: number;
  musicId: number;
  musicDifficulty: string;
  totalNoteCount: number;
  playLevel: string;
}

export class addMusicToListType {
  musicListId: string;
  musicGenreId: number;
  userId: string;
  selectedMusic: number[];
}

export class MusicType {
  id: number;
  name: string;
  musicTag: TagType[];
  metaMusic: MetaMusicType[];
}

export class RelationMyListType {
  musicId: number;
  musicGenreId: number;
  musicListId: string;
  music: MusicType;
}

export class detailMyListType {
  id: string;
  genreId: number;
  name: string;
  userId: string;
  musics: RelationMyListType[];
}
