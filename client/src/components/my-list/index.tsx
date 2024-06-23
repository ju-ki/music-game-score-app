import Sidebar from '../common/Sidebar';
import Header from '../common/Header';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import axiosClient from '../../utils/axios';
import { useUserStore } from '../store/userStore';
import { Link } from 'react-router-dom';
import { MyListType } from '../../types/score';
import MusicMyListModal from '../modal';
import { z } from 'zod';
import { useGenre } from '../store/useGenre';

const MyList = () => {
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
  const { user } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [musicList, setMusicList] = useState<MyListType[]>([]);
  const { currentGenre } = useGenre();

  useEffect(() => {
    getMusicList();
  }, [currentGenre]);

  const getMusicList = async () => {
    try {
      const response = await axiosClient.get(`${import.meta.env.VITE_APP_URL}music-list`, {
        params: {
          userId: user?.id,
          genreId: currentGenre || 1,
        },
      });

      setMusicList(response.data);
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

  const onSubmit = async (data: FormData) => {
    const musicIdList = data.selectedMusic.map((item) => item.id);
    try {
      const response = await axiosClient.post(`${import.meta.env.VITE_APP_URL}music-list`, {
        myListName: data.myListName,
        selectedMusic: musicIdList,
        genreId: currentGenre || 1,
        userId: user?.id,
      });
      setMusicList((prev) => [...prev, response.data]);
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className='flex h-screen'>
      <div className='flex-initial w-1/5'>
        <Sidebar />
      </div>

      <div className='flex-auto w-4/5'>
        <Header />
        <main className='p-4'>
          <h1>マイリスト</h1>
          <Button onClick={handleOpenModal}>マイリスト作成</Button>
          <MusicMyListModal
            isModalOpen={isModalOpen}
            handleCloseModal={handleCloseModal}
            onSubmit={onSubmit}
            defaultMusicList={[]}
            myListName=''
          />

          <div className='bg-gray-100 p-4 rounded-lg'>
            <h2 className='text-xl font-semibold mb-4'>マイリスト一覧</h2>
            {musicList.length ? (
              <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {musicList.map((music: MyListType) => (
                  <Link key={music.id} to={`/my-list/${music.id}`}>
                    <li className='bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer'>
                      <h3 className='text-lg font-semibold mb-2'>{music.name}</h3>
                      <p className='text-gray-500'>{music.musics.length || 0} 曲</p>
                    </li>
                  </Link>
                ))}
              </ul>
            ) : (
              <p className='text-gray-500'>マイリストがありません。</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyList;
