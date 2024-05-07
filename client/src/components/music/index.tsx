import React, { Fragment, useCallback, useRef, useState } from 'react';
import Header from '../common/Header';
import Sidebar from '../common/Sidebar';
import { useMusicQuery } from '../hooks/useMusicQuery';
import { Link } from 'react-router-dom';
import { MetaMusicType, MusicType, TagType, UnitType } from '../../types/score';

const MusicList = () => {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status, error } = useMusicQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUnit, setFilterUnit] = useState({});
  const [checkedState, setCheckedState] = useState(new Array(8).fill(false));

  // チェックボックスが変更されたときに呼ばれる関数
  const handleCheckboxChange = (position: number, unitName: string) => {
    const updatedCheckedState = checkedState.map((item, index) => (index === position ? !item : item));
    setCheckedState(updatedCheckedState);
    //Leo Needのデータがおかしいので修正
    if (unitName === 'light_sound') {
      unitName = 'light_music_club';
    }

    setFilterUnit((prev) => ({ ...prev, [unitName]: !checkedState[position] }));
  };
  const observer = useRef<IntersectionObserver | null>(null);
  const lastMusicElementRef = useCallback(
    (node: Element | null) => {
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const getFilteredMusicIds = () => {
    return data?.pages
      .flatMap((page) => page.items)
      .flatMap(
        (musicData) =>
          musicData.musicTag
            .filter((tag: TagType) =>
              Object.entries(filterUnit).some(([unitName, isChecked]) => isChecked && tag.tagName === unitName),
            )
            .map((tag: TagType) => tag.musicId), // Convert matching tags to an array of musicIds
      );
  };

  const filteredMusicList = data?.pages
    .flatMap((page) => page.items)
    .filter((musicData) => {
      const matchName = musicData.name.toLowerCase().includes(searchTerm);
      const filteredMusicIds = getFilteredMusicIds();
      const isMusicIdMatched = !filteredMusicIds?.length || filteredMusicIds.includes(musicData.id);
      return matchName && isMusicIdMatched;
    });

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
          <input
            type='text'
            placeholder='楽曲を検索'
            className='mb-4 mt-2 p-2 w-3/4 rounded border border-gray-300'
            onChange={handleSearchChange}
          />
          <div className='flex flex-wrap items-center mb-2 gap-2'>
            {data.pages?.[0].unitProfile?.map((unit: UnitType, idx: number) => (
              <div key={idx} className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id={`checkbox-${idx}`}
                  className='hidden'
                  onChange={() => handleCheckboxChange(idx, unit.unitName)}
                  checked={checkedState[idx]}
                />
                <label
                  htmlFor={`checkbox-${idx}`}
                  className={`flex items-center cursor-pointer py-1 px-2 rounded-full ${
                    checkedState[idx] ? 'bg-blue-400' : 'bg-slate-200'
                  }`}
                >
                  <img
                    className='w-5 h-5 mr-2'
                    src={`./logo_mini/unit_ts_${unit.seq}_penlight.png`}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {unit.unitProfileName}
                </label>
              </div>
            ))}
          </div>

          {/* TODO:難易度は一旦置いておく */}
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
          {searchTerm != '' || Object.keys(filterUnit).length > 0 ? (
            <>
              <div className='grid grid-cols-3 gap-4'>
                {filteredMusicList?.map((group, i) => (
                  <div key={i} ref={lastMusicElementRef} className='bg-white shadow-md rounded-lg p-4 my-2'>
                    <p className='text-lg font-semibold'>{group.name}</p>
                    <div className='my-2 flex justify-around items-center'>
                      {group?.metaMusic.map((meta: MetaMusicType, index: number) => (
                        <div key={index} className='flex items-center'>
                          <Link
                            to={`/register-music-score/${group.id}/${meta.musicDifficulty}`}
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
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {data.pages.map((music, index) => (
                <div key={index} className='grid grid-cols-3 gap-4'>
                  <Fragment key={index}>
                    {music.items.map((group: MusicType, i: number) => (
                      <div key={i} ref={lastMusicElementRef} className='bg-white shadow-md rounded-lg p-4 my-2'>
                        <p className='text-lg font-semibold'>{group.name}</p>
                        <div className='my-2 flex justify-around items-center'>
                          {group?.metaMusic.map((meta: MetaMusicType, index: number) => (
                            <div key={index} className='flex items-center'>
                              <Link
                                to={`/register-music-score/${group.id}/${meta.musicDifficulty}`}
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
                              </Link>
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
          )}
        </main>
      </div>
    </div>
  );
};

export default MusicList;
