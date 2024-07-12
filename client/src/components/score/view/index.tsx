import Sidebar from '../../common/Sidebar';
import Header from '../../common/Header';
import axiosClient from '../../../utils/axios';
import { useUserStore } from '../../store/userStore';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ScoreType } from '../../../types/score';
import { useGenre } from '../../store/useGenre';
import { Button } from '@mui/material';

const ScoresList = () => {
  const { user } = useUserStore();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchFromDate, setSearchFromDate] = useState<string | undefined>('');
  const [searchToDate, setSearchToDate] = useState<string | undefined>('');
  const [scoreList, setScoreList] = useState<ScoreType[]>([]);
  const [groupedScores, setGroupedScores] = useState<Record<string, ScoreType[]>>([]);
  const { currentGenre } = useGenre();
  useEffect(() => {
    getScoreList();
  }, [currentGenre]);
  async function getScoreList() {
    try {
      const response = await axiosClient.get(`${import.meta.env.VITE_APP_URL}/scores/list`, {
        params: {
          userId: user?.id,
          genreId: currentGenre || 1,
        },
      });

      setScoreList(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const filteredScores = scoreList.reduce(
      (groups, score) => {
        const date = new Date(score.createdAt).toLocaleDateString();
        if (!groups[date]) {
          groups[date] = [];
        }

        const matchesSearchTerm =
          searchTerm !== '' && score.music.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFromDate =
          searchFromDate && searchFromDate !== '' && new Date(searchFromDate) <= new Date(score.createdAt);

        let matchesToDate = true;
        if (searchToDate && searchToDate !== '') {
          const toDate = new Date(searchToDate);
          toDate.setHours(23, 59, 59, 999);
          matchesToDate = toDate >= new Date(score.createdAt);
        }

        if (searchTerm === '' && searchFromDate === '' && searchToDate === '') {
          groups[date].push(score);
        } else if (searchTerm !== '' && (searchFromDate !== '' || searchToDate !== '')) {
          if (
            matchesSearchTerm &&
            (matchesFromDate || searchFromDate === '') &&
            (matchesToDate || searchToDate === '')
          ) {
            groups[date].push(score);
          }
        } else {
          if (matchesSearchTerm || matchesFromDate || matchesToDate) {
            groups[date].push(score);
          }
        }

        return groups;
      },
      {} as Record<string, ScoreType[]>,
    );

    setGroupedScores(filteredScores);
  }, [searchTerm, searchFromDate, searchToDate, scoreList]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };
  const handleSearchFromDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFromDate(event.target.value);
  };
  const handleSearchToDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchToDate(event.target.value);
  };

  const handleResetButton = () => {
    setSearchTerm('');
    setSearchFromDate('');
    setSearchToDate('');
  };

  // const onClickCSVDownload = async () => {
  //   try {
  //     const response = await axiosClient.get(`${import.meta.env.VITE_APP_URL}scores/csv`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       params: {
  //         userId: user?.id,
  //         genreId: 1,
  //       },
  //     });

  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', 'スコア一覧.csv');
  //     document.body.appendChild(link);
  //     link.click();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  return (
    <div className='flex h-screen'>
      <div className='flex-initial w-1/5'>
        <Sidebar />
      </div>

      <div className='flex-auto w-4/5'>
        <Header />
        <main className='p-4'>
          <div className='my-2'>
            <div className='flex justify-between items-center'>
              <div className='text-xl'>スコア一覧</div>
              <div className='flex items-center space-x-4'>
                <input
                  type='text'
                  value={searchTerm}
                  placeholder='楽曲を検索'
                  className='p-2 rounded border border-gray-300'
                  onChange={handleSearchChange}
                />
                <div className='flex items-center space-x-2'>
                  <input
                    type='date'
                    className='p-2 rounded border border-gray-300'
                    onChange={handleSearchFromDateChange}
                    value={searchFromDate}
                  />
                  <span>~</span>
                  <input
                    type='date'
                    className='p-2 rounded border border-gray-300'
                    onChange={handleSearchToDateChange}
                    value={searchToDate}
                  />
                </div>
                <Button variant='contained' onClick={handleResetButton}>
                  リセット
                </Button>
              </div>
            </div>
          </div>
          {Object.entries(groupedScores).map(([date, scores]) => (
            <div className='my-6' key={date}>
              <h2 className='text-xl font-semibold my-4'>{new Date(date).toLocaleDateString('sv-SE')}</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {scores.map((score: ScoreType) => (
                  <Link
                    key={score.id}
                    to={`/score/${score.musicId}/${score.musicDifficulty}`}
                    className='text-lg font-semibold mb-2'
                  >
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
                        {currentGenre === 2 && (
                          <>
                            <div className='flex justify-between mb-1'>
                              <span className='font-semibold'>PerfectPlus:</span>
                              <span>{score.perfectPlusCount || 0}</span>
                            </div>
                          </>
                        )}
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
              <hr className='my-6' />
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default ScoresList;
