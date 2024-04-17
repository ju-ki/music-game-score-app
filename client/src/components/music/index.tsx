import { useEffect, useState } from 'react';
import Header from '../common/Header';
import axiosClient from '../../utils/axios';
import Sidebar from '../common/Sidebar';

const MusicList = () => {
  const [musicList, setMusicList] = useState<
    {
      id: number;
      name: string;
      assetBundleName: string;
    }[]
  >([]);
  useEffect(() => {
    getMusicList();
  }, []);

  async function getMusicList() {
    try {
      const myMusicLists = await axiosClient.get(`${import.meta.env.VITE_APP_URL}songs/search`, {
        params: {
          musicTag: 0,
          genreId: 1,
        },
      });
      setMusicList(myMusicLists.data);
      console.log(myMusicLists);
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
          <h1>楽曲一覧</h1>
          {musicList.map((music) => {
            return (
              <div key={music.id}>
                <p>{music.name}</p>
              </div>
            );
          })}
        </main>
      </div>
    </div>
    // <div>
    //   <Header />
    //   MusicList
    //   {musicList.map((music) => {
    //     return (
    //       <div key={music.id}>
    //         <p>{music.name}</p>
    //       </div>
    //     );
    //   })}
    // </div>
  );
};

export default MusicList;
