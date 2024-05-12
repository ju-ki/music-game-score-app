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
  metaMusic: MetaMusicType[];
};

export type MetaMusicType = {
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
