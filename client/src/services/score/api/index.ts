import axiosClient from '../../../utils/axios';
export const deleteScore = async (params: { scoreId: string; userId: string | undefined }) => {
  if (confirm('削除してもよろしいですか?')) {
    try {
      await axiosClient.delete(`${import.meta.env.VITE_APP_URL}scores`, {
        params: {
          userId: params.userId,
          scoreId: params.scoreId,
        },
      });
      alert('削除に成功しました');
    } catch (err) {
      console.log(err);
      //後にエラー文言の出し方を修正する
      alert('削除に失敗しました');
    }
  }
};
