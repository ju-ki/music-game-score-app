import { useEffect, useState } from 'react';
import Header from '../../common/Header';
import Sidebar from '../../common/Sidebar';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosClient from '../../../utils/axios';
import { useUserStore } from '../../store/userStore';
import { useNavigate, useParams } from 'react-router-dom';
import { ScoreType } from '../../../types/score';
import { Button } from '@mui/material';

const EditMusicScore = () => {
  const { user } = useUserStore();
  const { scoreId } = useParams();
  const [musicName, setMusicName] = useState('');
  const [score, setScore] = useState<ScoreType | null>(null);
  const navigate = useNavigate();

  const schema = z
    .object({
      scoreId: z.string({ message: '無効なスコアIDです' }).nonempty({ message: '無効なスコアIDです' }),
      musicId: z.number({ message: '曲を選択してください' }).min(1, '曲を選択してください'),
      musicDifficulty: z.string().nonempty(),
      perfectCount: z.number({ message: 'Perfectは数値を入力してください' }).min(0, '無効な数値です'),
      greatCount: z.number({ message: 'Greatは数値を入力してください' }).min(0, '無効な数値です'),
      goodCount: z.number({ message: 'Goodは数値を入力してください' }).min(0, '無効な数値です'),
      badCount: z.number({ message: 'Badは数値を入力してください' }).min(0, '無効な数値です'),
      missCount: z.number({ message: 'Missは数値を入力してください' }).min(0, '無効な数値です'),
      totalNoteCount: z.number({ message: '曲を選択するか、難易度を変更してください' }),
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
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const getScoreDetail = async () => {
    if (scoreId) {
      try {
        const response = await axiosClient.get(`${import.meta.env.VITE_APP_URL}scores/detail/`, {
          params: {
            userId: user?.id,
            scoreId: scoreId,
          },
        });
        setScore(response.data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    getScoreDetail();
  }, [scoreId]);

  useEffect(() => {
    if (score) {
      setValue('perfectCount', score.perfectCount);
      setValue('greatCount', score.greatCount);
      setValue('goodCount', score.goodCount);
      setValue('badCount', score.badCount);
      setValue('missCount', score.missCount);
      setValue('totalNoteCount', score.totalNoteCount);
      setValue('musicId', score.musicId);
      setMusicName(score.music.name);
      setValue('musicDifficulty', score.musicDifficulty);
      setValue('scoreId', score.id);
    }
  }, [score]);

  const watchedScores = getValues(['perfectCount', 'greatCount', 'goodCount', 'badCount', 'missCount']);
  const watchedPerfectCount = watch('perfectCount');
  const watchedGreatCount = watch('greatCount');
  const watchedGoodCount = watch('goodCount');
  const watchedBadCount = watch('badCount');
  const watchedMissCount = watch('missCount');
  const watchedTotalNoteCount = getValues('totalNoteCount');

  //テキストフィールドからフォーカスが外れた際にスコア補完機能が働く
  const onBlurScoreCompletion = () => {
    const filledFields = Object.values([
      watchedPerfectCount,
      watchedGreatCount,
      watchedGoodCount,
      watchedBadCount,
      watchedMissCount,
    ]).filter((val) => isNaN(val)).length;
    const count = watchedScores.reduce((accumulator, currentValue) => {
      const numericValue = Number(currentValue);
      return accumulator + (isNaN(numericValue) ? 0 : numericValue);
    }, 0);

    //TODO:: やり直しする際に不便
    const remainNoteCount = watchedTotalNoteCount - count;
    if (filledFields == 1) {
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
    //フルコンボまたはAP用のスコア補完機能
    else if (remainNoteCount === 0) {
      watchedScores.forEach((score, idx) => {
        if (isNaN(score) && idx == 0) {
          setValue('perfectCount', 0);
        }
        if (isNaN(score) && idx == 1) {
          setValue('greatCount', 0);
        }
        if (isNaN(score) && idx == 2) {
          setValue('goodCount', 0);
        }
        if (isNaN(score) && idx == 3) {
          setValue('badCount', 0);
        }
        if (isNaN(score) && idx == 4) {
          setValue('missCount', 0);
        }
      });
    }
  };

  const onSubmit = async (values: FormData) => {
    console.log(values);
    try {
      await axiosClient.post(`${import.meta.env.VITE_APP_URL}scores`, {
        ...values,
        genreId: 1,
        userId: user?.id,
      });
      navigate(`/score/${values.musicId}/${values.musicDifficulty}`);
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
          <h1 className='text-2xl font-bold mb-4'>スコア編集</h1>
          <form onSubmit={handleSubmit(onSubmit)} className='p-4 bg-white shadow-md rounded-md'>
            <div>
              {errors.scoreId && <span className='text-red-500 mb-2 block'>{errors.scoreId.message}</span>}
              <input
                value={musicName}
                type='text'
                placeholder='楽曲名'
                disabled
                className='mb-4 p-2 rounded border border-gray-300 w-full'
              />
            </div>
            <input type='hidden' {...register('musicId', { required: true, valueAsNumber: true })} />
            {errors.musicId && <span className='text-red-500 mb-2 block'>{errors.musicId.message}</span>}
            <select
              {...register('musicDifficulty', { required: true })}
              className='mb-4 p-2 rounded border border-gray-300 w-full'
              disabled
            >
              <option>{score?.musicDifficulty}</option>
            </select>
            {errors.totalNoteCount && <span className='text-red-500 mb-2 block'>{errors.totalNoteCount.message}</span>}
            <input
              {...register('totalNoteCount')}
              type='number'
              disabled
              className='mb-4 p-2 rounded border border-gray-300 w-full'
            />
            <input
              {...register('perfectCount', { required: true, valueAsNumber: true })}
              type='number'
              placeholder='Perfect'
              min={0}
              onBlur={onBlurScoreCompletion}
              className='mb-4 p-2 rounded border border-gray-300 w-full'
            />
            {errors.perfectCount && <span className='text-red-500 mb-2 block'>{errors.perfectCount.message}</span>}
            <input
              {...register('greatCount', { required: true, valueAsNumber: true })}
              type='number'
              placeholder='Great'
              min={0}
              onBlur={onBlurScoreCompletion}
              className='mb-4 p-2 rounded border border-gray-300 w-full'
            />
            {errors.greatCount && <span className='text-red-500 mb-2 block'>{errors.greatCount.message}</span>}
            <input
              {...register('goodCount', { required: true, valueAsNumber: true })}
              type='number'
              placeholder='Good'
              min={0}
              onBlur={onBlurScoreCompletion}
              className='mb-4 p-2 rounded border border-gray-300 w-full'
            />
            {errors.goodCount && <span className='text-red-500 mb-2 block'>{errors.goodCount.message}</span>}
            <input
              {...register('badCount', { required: true, valueAsNumber: true })}
              type='number'
              placeholder='Bad'
              min={0}
              onBlur={onBlurScoreCompletion}
              className='mb-4 p-2 rounded border border-gray-300 w-full'
            />
            {errors.badCount && <span className='text-red-500 mb-2 block'>{errors.badCount.message}</span>}
            <input
              {...register('missCount', { required: true, valueAsNumber: true })}
              type='number'
              placeholder='Miss'
              min={0}
              onBlur={onBlurScoreCompletion}
              className='mb-4 p-2 rounded border border-gray-300 w-full'
            />
            {errors.missCount && <span className='text-red-500 mb-2 block'>{errors.missCount.message}</span>}
            <div className='flex items-center'>
              <Button variant='contained' type='submit'>
                スコアを編集する
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditMusicScore;
