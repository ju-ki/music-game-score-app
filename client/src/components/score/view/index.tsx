import Sidebar from '../../common/Sidebar';
import Header from '../../common/Header';
import axiosClient from '../../../utils/axios';
import { useUserStore } from '../../store/userStore';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ScoreType } from '../../../types/score';

const ScoresList = () => {
  const { user } = useUserStore();
  const [scoreList, setScoreList] = useState([]);
  useEffect(() => {
    getScoreList();
  }, []);
  async function getScoreList() {
    try {
      const response = await axiosClient.get(`${import.meta.env.VITE_APP_URL}scores/list`, {
        params: {
          userId: user?.id,
          genreId: 1,
        },
      });
      console.log(response.data);
      setScoreList(response.data);
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
          <h1>スコア一覧</h1>
          {scoreList.length ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {scoreList.map((score: ScoreType) => (
                <Link to={`/score/${score.musicId}/${score.musicDifficulty}`} className='text-lg font-semibold mb-2'>
                  <div key={score.id} className='bg-white shadow-md rounded-lg p-4'>
                    <h2 className='text-lg font-semibold mb-2'>
                      {score.music.name} ({score.musicDifficulty})
                    </h2>
                    <p className='text-gray-600 mb-2'>
                      {new Date(score.createdAt).toLocaleString(undefined, {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </p>
                    <div className='flex flex-col'>
                      <div className='flex justify-between mb-1'>
                        <span className='font-semibold'>TotalNoteCount</span>
                        <span>{score.totalNoteCount}</span>
                      </div>
                      <div className='flex justify-between mb-1'>
                        <span className='font-semibold'>Perfect:</span>
                        <span>{score.perfectCount}</span>
                      </div>
                      <div className='flex justify-between mb-1'>
                        <span className='font-semibold'>Great:</span>
                        <span>{score.greatCount}</span>
                      </div>
                      <div className='flex justify-between mb-1'>
                        <span className='font-semibold'>Good:</span>
                        <span>{score.goodCount}</span>
                      </div>
                      <div className='flex justify-between mb-1'>
                        <span className='font-semibold'>Bad:</span>
                        <span>{score.badCount}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='font-semibold'>Miss:</span>
                        <span>{score.missCount}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className='text-center'>
              <p>スコアがありません</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ScoresList;
