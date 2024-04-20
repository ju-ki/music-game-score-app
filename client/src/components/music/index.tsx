import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import Header from '../common/Header';
import axiosClient from '../../utils/axios';
import Sidebar from '../common/Sidebar';
import { useQuery } from '@tanstack/react-query';
import { useMusicQuery } from '../hooks/useMusicQuery';

const MusicList = () => {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status, error } = useMusicQuery();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastMusicElementRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return; // 既に次のページを取得中なら何もしない
      if (observer.current) observer.current.disconnect(); // 既存のObserverを切断
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage(); // 要素が見えるようになったら次のページを取得
        }
      });
      if (node) observer.current.observe(node); // 新しい要素を監視
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage],
  );

  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error') return <div>Error: {error.message}</div>;
  return (
    <div className='flex h-screen'>
      <div className='flex-initial w-1/5'>
        <Sidebar />
      </div>

      <div className='flex-auto w-4/5'>
        <Header />
        <main className='p-4'>
          <input type='text' placeholder='楽曲を検索' className='mb-4 mt-2 p-2 w-3/4 rounded border border-gray-300' />
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
          <>
            {data.pages.map((music, index) => (
              <div className='grid grid-cols-3 gap-4'>
                <Fragment key={index}>
                  {music.items.map((group, i) => (
                    <div key={i} ref={lastMusicElementRef} className='bg-white shadow-md rounded-lg p-4 my-2'>
                      <p className='text-lg font-semibold'>{group.name}</p>
                      <div className='my-2 flex justify-around items-center'>
                        {group?.metaMusic.map((meta, index) => (
                          <div key={index} className='flex items-center'>
                            <div
                              className={`w-6 h-6 flex items-center justify-center rounded-full text-white font-semibold ${
                                meta.musicDifficulty === 'easy'
                                  ? 'bg-green-500'
                                  : meta.musicDifficulty === 'normal'
                                    ? 'bg-blue-300'
                                    : meta.musicDifficulty === 'hard'
                                      ? 'bg-yellow-500'
                                      : meta.musicDifficulty === 'expert'
                                        ? 'bg-red-500'
                                        : meta.musicDifficulty === 'master'
                                          ? 'bg-purple-500'
                                          : meta.musicDifficulty === 'append'
                                            ? 'bg-pink-500'
                                            : ''
                              }`}
                            >
                              {meta.playLevel}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </Fragment>
              </div>
            ))}
            <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
          </>
        </main>
      </div>
    </div>
  );
};

export default MusicList;
