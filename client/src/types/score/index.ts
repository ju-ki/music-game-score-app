export type ScoreType = {
  totalNoteCount: number;
  perfectCount: number;
  greatCount: number;
  goodCount: number;
  badCount: number;
  missCount: number;
  musicDifficulty: string;
  createdAt: Date;
  musicId: number;
  id: string;
  music: MusicType;
};

export type MusicType = {
  id: number;
  name: string;
  musicTag: TagType[];
  metaMusic: MetaMusicType[];
};

export type MetaMusicType = {
  id: number;
  musicId: number;
  musicDifficulty: string;
  totalNoteCount: number;
  playLevel: string;
};

export type UnitType = {
  unitName: string;
  unitProfileName: string;
  seq: number;
};

export type TagType = {
  id: number;
  musicId: number;
  tagName: string;
};

export type RelationMyListType = {
  musicId: number;
  musicGenreId: number;
  musicListId: string;
  music: MusicType;
};

export type MyListType = {
  id: string;
  genreId: number;
  name: string;
  userId: string;
  musics: RelationMyListType[];
};

export type SelectedMusicType = {
  id: number;
};

export type UserType = {
  id: string;
  email: string;
  name: string;
  imageUrl: string;
  authority: string;
};

export type UpdateUserAuthorityData = {
  users: {
    id: string;
    authority: string;
  }[];
};
