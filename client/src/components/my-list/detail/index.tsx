import React, { useEffect, useState } from 'react';
import Header from '../../common/Header';
import Sidebar from '../../common/Sidebar';
import { Link, useParams } from 'react-router-dom';
import axiosClient from '../../../utils/axios';
import { useUserStore } from '../../store/userStore';

const MyListDetail = () => {
  const { myListId } = useParams();
  const { user } = useUserStore();
  const [musicDetail, setMusicDetail] = useState();

  useEffect(() => {
    if (myListId) {
      getMyListDetail();
    }
  }, [myListId, user]);

  async function getMyListDetail() {
    try {
      const response = await axiosClient.get(`${import.meta.env.VITE_APP_URL}music-list/getMyList`, {
        params: {
          myListId: myListId,
          userId: user?.id,
          genreId: 1,
        },
      });
      setMusicDetail(response.data);

      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
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
            <h1 className='text-2xl font-semibold mb-4'>{musicDetail?.name}</h1>
            <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {musicDetail?.musics.map((music) => (
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
