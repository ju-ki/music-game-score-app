import { useEffect, useState } from 'react';
import { showToast } from '../../../components/common/Toast';
import axiosClient from '../../../utils/axios';
import { ScoreType } from '../../../types/score';
export const deleteScore = async (params: { scoreId: string; userId: string | undefined }) => {
  if (confirm('削除してもよろしいですか?')) {
    try {
      await axiosClient.delete(`${import.meta.env.VITE_APP_URL}scores`, {
        params: {
          userId: params.userId,
          scoreId: params.scoreId,
        },
      });
      showToast('success', 'スコアの削除に成功しました');
    } catch (err) {
      console.log(err);
      showToast('error', 'スコアの削除に失敗しました');
    }
  }
};

export const useScoreDetail = (params: { scoreId: string | undefined; userId: string | undefined }) => {
  const [scoreDetail, setScoreDetail] = useState<ScoreType>();

  useEffect(() => {
    fetchScoreDetail();
  }, [params.scoreId, params.userId]);

  async function fetchScoreDetail() {
    if (params.scoreId && params.userId) {
      try {
        const response = await axiosClient.get(`${import.meta.env.VITE_APP_URL}scores/detail/`, {
          params: {
            userId: params.userId,
            scoreId: params.scoreId,
          },
        });
        setScoreDetail(response.data);
      } catch (err) {
        console.log(err);
        showToast('error', 'スコアの詳細情報の取得に失敗しました');
      }
    }
  }

  return {
    scoreDetail: scoreDetail,
  };
};
