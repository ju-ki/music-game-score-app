import { useEffect, useState } from 'react';
import Header from '../../common/Header';
import Sidebar from '../../common/Sidebar';
import { useForm } from 'react-hook-form';
import { fetchMusicList } from '../../hooks/useMusicQuery';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosClient from '../../../utils/axios';
import { useUserStore } from '../../store/userStore';

const RegisterMusicScore = () => {
  const { user } = useUserStore();
  const schema = z
    .object({
      musicId: z.number(),
      musicDifficulty: z.string().nonempty(),
      perfectCount: z.number({ message: 'Perfectは数値を入力してください' }).min(0, '無効な数値です'),
      greatCount: z.number({ message: 'Greatは数値を入力してください' }).min(0, '無効な数値です'),
      goodCount: z.number({ message: 'Goodは数値を入力してください' }).min(0, '無効な数値です'),
      badCount: z.number({ message: 'Badは数値を入力してください' }).min(0, '無効な数値です'),
      missCount: z.number({ message: 'Missは数値を入力してください' }).min(0, '無効な数値です'),
      totalNoteCount: z.number(),
    })
    .refine(
      (data) =>
        data.totalNoteCount === data.perfectCount + data.greatCount + data.goodCount + data.badCount + data.missCount,
      {
        message: '総ノーツ数と数が合っていません',
        path: ['totalNoteCount'],
      },
    );

  type FormData = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const getAllMusic = async () => {
    try {
      const response = await fetchMusicList(0);
      setMusicList(response.items);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllMusic();
  }, []);

  const [musicList, setMusicList] = useState([]);

  const [difficultyList, setDifficultyList] = useState(['easy', 'normal', 'hard', 'expert', 'master', 'append']);

  const watchMusic = watch(['musicId', 'musicDifficulty']);

  useEffect(() => {
    if (watchMusic[0] && watchMusic[1]) {
      const musicId = watchMusic[0];
      const musicDifficulty = watchMusic[1];
      const data = musicList
        .flatMap((music) => music.metaMusic)
        .filter((meta) => musicId == meta.musicId && musicDifficulty == meta.musicDifficulty);
      if (data[0]) {
        setValue('totalNoteCount', data[0].totalNoteCount);
      }
    }
  }, [watchMusic, musicList, setValue]);

  const watchedScores = getValues(['perfectCount', 'greatCount', 'goodCount', 'badCount', 'missCount']);
  const watchedPerfectCount = watch('perfectCount');
  const watchedGreatCount = watch('greatCount');
  const watchedGoodCount = watch('goodCount');
  const watchedBadCount = watch('badCount');
  const watchedMissCount = watch('missCount');
  const watchedTotalNoteCount = getValues('totalNoteCount');

  useEffect(() => {
    const filledFields = Object.values(watchedScores).filter((val) => isNaN(val)).length;
    if (filledFields == 1) {
      const count = watchedScores.reduce((accumulator, currentValue) => {
        const numericValue = Number(currentValue);
        return accumulator + (isNaN(numericValue) ? 0 : numericValue);
      }, 0);
      // console.log(watchedScores);
      //TODO:: やり直しする際に不便

      const remainNoteCount = watchedTotalNoteCount - count;
      watchedScores.forEach((score, idx) => {
        if (isNaN(score) && idx == 0) {
          setValue('perfectCount', remainNoteCount);
        }
        if (isNaN(score) && idx == 1) {
          setValue('greatCount', remainNoteCount);
        }
        if (isNaN(score) && idx == 2) {
          setValue('goodCount', remainNoteCount);
        }
        if (isNaN(score) && idx == 3) {
          setValue('badCount', remainNoteCount);
        }
        if (isNaN(score) && idx == 4) {
          setValue('missCount', remainNoteCount);
        }
      });
    }
  }, [
    watchedTotalNoteCount,
    getValues,
    watchedPerfectCount,
    watchedGreatCount,
    watchedGoodCount,
    watchedBadCount,
    watchedMissCount,
  ]);

  const onSubmit = async (values: FormData) => {
    console.log(values);
    try {
      await axiosClient.post(`${import.meta.env.VITE_APP_URL}scores`, {
        ...values,
        genreId: 1,
        userId: user?.id,
      });
      reset({
        perfectCount: NaN,
        greatCount: NaN,
        goodCount: NaN,
        badCount: NaN,
        missCount: NaN,
      });
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
          <h1 className='text-2xl font-bold mb-4'>スコア登録</h1>
          <form onSubmit={handleSubmit(onSubmit)} className='p-4 bg-white shadow-md rounded-md'>
            <select
              {...register('musicId', { required: true, valueAsNumber: true })}
              className='mb-4 p-2 rounded border border-gray-300 w-full'
            >
              {musicList.map((music) => (
                <option key={music.id} value={music.id}>
                  {music.name}
                </option>
              ))}
            </select>
            <select
              {...register('musicDifficulty', { required: true })}
              className='mb-4 p-2 rounded border border-gray-300 w-full'
            >
              {difficultyList.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
            <input
              {...register('totalNoteCount')}
              type='number'
              disabled
              className='mb-4 p-2 rounded border border-gray-300 w-full'
            />
            {errors.totalNoteCount && <span className='text-red-500 mb-2 block'>{errors.totalNoteCount.message}</span>}
            <input
              {...register('perfectCount', { required: true, valueAsNumber: true })}
              type='number'
              placeholder='Perfect'
              min={0}
              className='mb-4 p-2 rounded border border-gray-300 w-full'
            />
            {errors.perfectCount && <span className='text-red-500 mb-2 block'>{errors.perfectCount.message}</span>}
            <input
              {...register('greatCount', { required: true, valueAsNumber: true })}
              type='number'
              placeholder='Great'
              min={0}
              className='mb-4 p-2 rounded border border-gray-300 w-full'
            />
            {errors.greatCount && <span className='text-red-500 mb-2 block'>{errors.greatCount.message}</span>}
            <input
              {...register('goodCount', { required: true, valueAsNumber: true })}
              type='number'
              placeholder='Good'
              min={0}
              className='mb-4 p-2 rounded border border-gray-300 w-full'
            />
            {errors.goodCount && <span className='text-red-500 mb-2 block'>{errors.goodCount.message}</span>}
            <input
              {...register('badCount', { required: true, valueAsNumber: true })}
              type='number'
              placeholder='Bad'
              min={0}
              className='mb-4 p-2 rounded border border-gray-300 w-full'
            />
            {errors.badCount && <span className='text-red-500 mb-2 block'>{errors.badCount.message}</span>}
            <input
              {...register('missCount', { required: true, valueAsNumber: true })}
              type='number'
              placeholder='Miss'
              min={0}
              className='mb-4 p-2 rounded border border-gray-300 w-full'
            />
            {errors.missCount && <span className='text-red-500 mb-2 block'>{errors.missCount.message}</span>}
            <button type='submit' className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>
              Register Score
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default RegisterMusicScore;
