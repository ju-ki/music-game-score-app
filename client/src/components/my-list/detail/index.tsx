import { useEffect, useState } from 'react';
import Header from '../../common/Header';
import Sidebar from '../../common/Sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../../utils/axios';
import { useUserStore } from '../../store/userStore';
import { MyListType, RelationMyListType } from '../../../types/score';
import MusicMyListModal from '../../modal';
import { Button } from '@mui/material';
import { z } from 'zod';
import { useGenre } from '../../store/useGenre';

const MyListDetail = () => {
  const schema = z.object({
    myListName: z.string().min(1, { message: 'マイリスト名は必須です' }),
    selectedMusic: z
      .array(
        z.object({
          id: z.number(),
        }),
      )
      .nonempty({ message: '一つ以上の曲を選択してください' }),
  });
  type FormData = z.infer<typeof schema>;
  const { myListId } = useParams();
  const { user } = useUserStore();
  const [musicDetail, setMusicDetail] = useState<MyListType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentGenre } = useGenre();
  const navigate = useNavigate();

  useEffect(() => {
    if (myListId) {
      getMyListDetail();
    }
  }, [myListId]);

  async function getMyListDetail() {
    try {
      const response = await axiosClient.get(`${import.meta.env.VITE_APP_URL}/music-list/getMyList`, {
        params: {
          myListId: myListId,
          userId: user?.id,
          genreId: currentGenre,
        },
      });

      setMusicDetail(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  const addMusicToMyList = async (data: FormData) => {
    try {
      const musicIdList = data.selectedMusic.map((item) => item.id);
      const response = await axiosClient.post(`${import.meta.env.VITE_APP_URL}/music-list/add`, {
        musicListId: myListId,
        selectedMusic: musicIdList,
        userId: user?.id,
        musicGenreId: currentGenre,
      });
      setMusicDetail(response.data);
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const deleteMyMusicList = async () => {
    if (confirm('マイリストを削除します。\n削除後はデータの復元は行えません。\nよろしいですか?')) {
      try {
        const response = await axiosClient.delete(`${import.meta.env.VITE_APP_URL}/music-list`, {
          params: {
            musicListId: myListId,
            userId: user?.id,
            genreId: currentGenre,
          },
        });
        console.log(response);
        alert('マイリストの削除に成功しました');
        navigate('/my-list');
      } catch (err) {
        alert('マイリストの削除に失敗しました');
        console.log(err);
      }
    }
  };

  if (!musicDetail) {
    return;
  }

  return (
    <div className='flex h-screen'>
      <div className='flex-initial w-1/5'>
        <Sidebar />
      </div>
      <div className='flex-auto w-4/5'>
        <Header />
        <main className='p-4'>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <MusicMyListModal
              isModalOpen={isModalOpen}
              handleCloseModal={handleCloseModal}
              onSubmit={addMusicToMyList}
              defaultMusicList={musicDetail?.musics.map((obj) => obj.musicId)}
              myListName={musicDetail?.name}
            />
            <div className='flex items-center justify-between my-3 '>
              <h1 className='text-2xl font-semibold mb-4'>{musicDetail?.name}</h1>
              <div className='space-x-3'>
                <Button onClick={handleOpenModal} variant='contained'>
                  マイリスト編集
                </Button>
                <Button onClick={() => deleteMyMusicList()} variant='contained' color='error'>
                  マイリスト削除
                </Button>
              </div>
            </div>
            <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {musicDetail?.musics.map((music: RelationMyListType) => (
                <Link
                  key={music.musicId}
                  to={`/register-music-score/${music.musicId}`}
                  className='bg-gray-100 rounded-lg p-4 shadow hover:shadow-md transition-shadow duration-300'
                >
                  {music.music.name}
                </Link>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyListDetail;
