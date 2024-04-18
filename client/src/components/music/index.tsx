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
          <input
            type='text'
            placeholder='楽曲を検索'
            className='mb-4 mt-2 p-2 w-3/4 rounded border border-gray-300'
            // onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className='flex mb-2'>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className='flex items-center mr-4'>
                <input type='checkbox' id={`checkbox-${index}`} className='mr-2' />
                <label htmlFor={`checkbox-${index}`}>Option {index + 1}</label>
              </div>
            ))}
          </div>
          {/* セレクトボックスの行 */}
          <div className='flex mb-4'>
            {Array.from({ length: 6 }).map((_, index) => (
              <select key={index} className='mr-4 p-2 rounded border border-gray-300'>
                <option value=''>Select</option>
                <option value='option1'>Option 1</option>
                <option value='option2'>Option 2</option>
                <option value='option3'>Option 3</option>
              </select>
            ))}
          </div>
          <h1>楽曲一覧</h1>
          <div className='grid grid-cols-3 gap-4'>
            {musicList.map((music) => (
              <div key={music.id} className='bg-white shadow-md rounded-lg p-4'>
                <p className='text-lg font-semibold'>{music.name}</p>
              </div>
            ))}
          </div>
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
