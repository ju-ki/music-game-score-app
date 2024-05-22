export class postScoreType {
  id?: string;
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
}

export class scoreListParams {
  userId: string;
  genreId: number;
  musicId: number;
  musicDifficulty: string;
}

export class deleteScoreParams {
  userId: string;
  scoreId: string;
}
