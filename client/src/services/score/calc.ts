import { useEffect, useState } from 'react';
import { ScoreType } from '../../types/score';
import { useGenre } from '../../components/store/useGenre';

export const useScoreCount = (scoreList: ScoreType[]) => {
  const { currentGenre } = useGenre();
  const [countPlayCount, setPlayCount] = useState<number>(0);
  const [countFullCombCount, setCountFullCombCount] = useState<number>(0);
  const [countAllPerfectCount, setCountAllPerfectCount] = useState<number>(0);

  useEffect(() => {
    let playCount: number = 0;
    let fullCombCount: number = 0;
    let allPerfectCount: number = 0;

    scoreList.forEach((score) => {
      playCount++;
      if (currentGenre === 1 && score.perfectCount + score.greatCount === score.totalNoteCount) {
        fullCombCount++;
      } else if (
        currentGenre === 2 &&
        (score.perfectPlusCount || 0) + score.perfectCount + score.greatCount === score.totalNoteCount
      ) {
        fullCombCount++;
      }

      if (currentGenre === 1 && score.perfectCount === score.totalNoteCount) {
        allPerfectCount++;
      } else if (currentGenre === 2 && (score.perfectPlusCount || 0) + score.perfectCount === score.totalNoteCount) {
        allPerfectCount++;
      }
    });

    setPlayCount(playCount);
    setCountFullCombCount(fullCombCount);
    setCountAllPerfectCount(allPerfectCount);
  }, [scoreList, currentGenre]);

  return {
    countPlayCount,
    countFullCombCount,
    countAllPerfectCount,
  };
};
