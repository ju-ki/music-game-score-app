export class postScoreType {
  scoreId?: string;
  musicId: number;
  genreId: number;
  musicDifficulty: string;
  perfectPlusCount?: number;
  perfectCount: number;
  greatCount?: number;
  goodCount?: number;
  badCount?: number;
  missCount: number;
  userId: string;
  sortId: number;
}

export class scoreListParams {
  userId: string;
  genreId: number;
  musicId: number;
  musicDifficulty: string;
  sortId: number;
}

export class deleteScoreParams {
  userId: string;
  scoreId: string;
}

export interface ScoreRecord {
  name: string;
  difficulty: string;
  perfectPlusCount?: number;
  perfectCount: number;
  greatCount: number;
  goodCount: number;
  badCount: number;
  missCount: number;
  createdAt: string;
}

export class scoreParams {
  id: string;
  musicId: number;
  totalNoteCount: number;
  perfectPlusCount?: number;
  perfectCount: number;
  greatCount: number;
  goodCount: number;
  badCount: number;
  missCount: number;
  musicDifficulty: string;
  name?: string;
}
