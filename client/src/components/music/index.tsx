import { useEffect, useState } from 'react';
import Header from '../common/Header';
import axiosClient from '../../utils/axios';

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
    <div>
      <Header />
      MusicList
      {musicList.map((music) => {
        return (
          <div key={music.id}>
            <p>{music.name}</p>
          </div>
        );
      })}
    </div>
  );
};

export default MusicList;
