import { useEffect, useState } from 'react';
import { addMusicToMyList, deleteMyListMusic, getMyListDetail } from '../../services/mylist/api';
import { useUserStore } from '../store/userStore';
import { useNavigate, useParams } from 'react-router-dom';
import { useGenre } from '../store/useGenre';
import { MyListType } from '../../types/score';
import { showToast } from '../common/Toast';
import { FormData } from '../modal';

export const useFetchMyList = () => {
  const [myListDetail, setMyListDetail] = useState<MyListType>();
  const { user } = useUserStore();
  const { myListId } = useParams();
  const { currentGenre } = useGenre();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchMyListDetail();
  }, [myListId]);

  async function fetchMyListDetail() {
    try {
      if (myListId) {
        setIsLoading(true);
        const response = await getMyListDetail({
          userId: user?.id,
          genreId: currentGenre,
          myListId: myListId,
        });

        if (response) {
          setMyListDetail(response);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'マイリストの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }
  return {
    isLoading,
    myListDetail,
  };
};

export const useAddMusic = (setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [updatedMyListDetail, setMyListDetail] = useState<MyListType>();
  const { user } = useUserStore();
  const { myListId } = useParams();
  const { currentGenre } = useGenre();
  const addMusic = async (data: FormData) => {
    try {
      if (myListId) {
        const response = await addMusicToMyList({ myListId, userId: user?.id, genreId: currentGenre }, data);
        setMyListDetail(response);
        showToast('success', 'マイリストの編集に成功しました');
      }
    } catch (err) {
      console.log(err);
      showToast('error', 'マイリストの編集に失敗しました');
    } finally {
      setIsModalOpen(false);
    }
  };

  return {
    addMusic,
    updatedMyListDetail,
  };
};

export const useDeleteMyList = () => {
  const { user } = useUserStore();
  const { myListId } = useParams();
  const { currentGenre } = useGenre();
  const navigate = useNavigate();
  const deleteMyList = async () => {
    try {
      if (myListId && confirm('マイリストを削除します。\n削除後はデータの復元は行えません。\nよろしいですか?')) {
        await deleteMyListMusic({
          userId: user?.id,
          genreId: currentGenre,
          myListId: myListId,
        });
        showToast('success', 'マイリストの削除に成功しました');
        navigate('/my-list');
      }
    } catch (err) {
      console.log(err);
      showToast('error', 'マイリストの削除に失敗しました');
    }
  };

  return { deleteMyList };
};
