export class searchWords {
  title?: string;
  musicDifficulty?: string;
  musicTag?: number;
  playLevel?: string;
  genreId?: number;
  page?: number;
  isInfinityScroll: string;
}

export class EditScoreDto {
  genreId: number;
  metaMusic: MetaMusicDto[];
}

export class MetaMusicDto {
  id: string;
  musicId: number;
  musicDifficulty: string;
  totalNoteCount: number;
}
