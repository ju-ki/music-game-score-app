import { useEffect, useState } from 'react';
import { BestScoreType, ScoreType } from '../../types/score';
import axiosClient from '../../utils/axios';
import { useUserStore } from '../store/userStore';
import { useGenre } from '../store/useGenre';
import { useParams } from 'react-router-dom';

export const useFetchScoreList = (sortId: number) => {
  const { user } = useUserStore();
  const { currentGenre } = useGenre();
  const { musicId, musicDifficulty } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scoreList, setScoreList] = useState<ScoreType[]>([]);
  const [bestScore, setBestScore] = useState<BestScoreType>();
  const [musicName, setMusicName] = useState<string>('');

  useEffect(() => {
    getScoreList();
  }, [currentGenre, musicId, musicDifficulty, sortId]);

  async function getScoreList() {
    try {
      setIsLoading(true);
      const response = await axiosClient.get(`${import.meta.env.VITE_APP_URL}scores/detailList`, {
        params: {
          userId: user?.id,
          genreId: currentGenre || 1,
          musicId: musicId,
          musicDifficulty: musicDifficulty,
          sortId: sortId || 0,
        },
      });
      setMusicName(response.data.music.name);
      setScoreList(response.data.scoreList);
      setBestScore(response.data.bestScore);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    scoreList,
    isLoading,
    musicName,
    bestScore,
  };
};
