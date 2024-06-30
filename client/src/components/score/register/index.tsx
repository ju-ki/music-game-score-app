import { ComponentProps, forwardRef, useEffect, useState } from 'react';
import Header from '../../common/Header';
import Sidebar from '../../common/Sidebar';
import { useForm } from 'react-hook-form';
import { fetchMusicList } from '../../hooks/useMusicQuery';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosClient from '../../../utils/axios';
import { useUserStore } from '../../store/userStore';
import { useParams } from 'react-router-dom';
import { MetaMusicType, MusicType, ScoreType } from '../../../types/score';
import { Autocomplete, Button, Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';
import { useGenre } from '../../store/useGenre';
import { useScoreDetail } from '../../../services/score/api';
import { showToast } from '../../common/Toast';
import { toast } from 'react-toastify';

const RegisterMusicScore = () => {
  const { user } = useUserStore();
  const { musicId, musicDifficulty, scoreId } = useParams();
  const [selectedMusic, setSelectedMusic] = useState<MusicType | null>(null);
  const [registerConsecutively, setRegisterConsecutively] = useState<boolean>(true);
  const { currentGenre } = useGenre();
  const [difficultyList, setDifficultyList] = useState<string[]>([]);
  const [musicList, setMusicList] = useState<MusicType[]>([]);
  const { scoreDetail } = useScoreDetail({ scoreId: scoreId, userId: user?.id });

  useEffect(() => {
    if (scoreDetail && scoreDetail.music && musicList.length) {
      setValue('perfectCount', scoreDetail.perfectCount);
      setValue('greatCount', scoreDetail.greatCount);
      setValue('goodCount', scoreDetail.goodCount);
      setValue('badCount', scoreDetail.badCount);
      setValue('missCount', scoreDetail.missCount);
      setValue('totalNoteCount', scoreDetail.totalNoteCount);
      setValue('musicId', scoreDetail.musicId);
      setSelectedMusic(scoreDetail.music);
      setValue('musicDifficulty', scoreDetail.musicDifficulty);
      setValue('scoreId', scoreDetail.id);
      currentGenre === 2 && setValue('perfectPlusCount', scoreDetail.perfectPlusCount);
    }

    if (musicId && musicList.length) {
      setSelectedMusic(musicList.find((music) => music.id === Number(musicId)) || null);
    }
  }, [scoreDetail, musicList]);

  const schema = z
    .object({
      scoreId: z.string().optional(),
      musicId: z.number({ message: '曲を選択してください' }).min(1, '曲を選択してください'),
      musicDifficulty: z.string().nonempty(),
      perfectPlusCount:
        currentGenre === 2
          ? z.number({ message: 'PerfectPlusは数値を入力してください' }).min(0, '無効な数値です')
          : z.number().optional(),
      perfectCount: z.number({ message: 'Perfectは数値を入力してください' }).min(0, '無効な数値です'),
      greatCount: z.number({ message: 'Greatは数値を入力してください' }).min(0, '無効な数値です'),
      goodCount: z.number({ message: 'Goodは数値を入力してください' }).min(0, '無効な数値です'),
      badCount: z.number({ message: 'Badは数値を入力してください' }).min(0, '無効な数値です'),
      missCount: z.number({ message: 'Missは数値を入力してください' }).min(0, '無効な数値です'),
      totalNoteCount: z.number({ message: '曲を選択するか、難易度を変更してください' }),
    })
    .refine(
      (data) => {
        if (currentGenre === 2 && data.perfectPlusCount) {
          return (
            data.totalNoteCount ===
            data.perfectPlusCount +
              data.perfectCount +
              data.greatCount +
              data.goodCount +
              data.badCount +
              data.missCount
          );
        } else {
          return (
            data.totalNoteCount ===
            data.perfectCount + data.greatCount + data.goodCount + data.badCount + data.missCount
          );
        }
      },
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
    formState,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (Object.keys(errors).length) {
      showToast('error', '入力項目に不備があります');
    }
  }, [errors]);

  const getAllMusic = async () => {
    let loadingToastId;
    if (!loadingToastId) {
      loadingToastId = showToast('info', '楽曲情報を取得中', { autoClose: false, closeOnClick: false });
    }
    try {
      const response = await fetchMusicList(0, false, currentGenre);

      setMusicList(response.items);
      if (musicId && response.items.find((item: MusicType) => item.id === parseInt(musicId))) {
        setValue('musicId', parseInt(musicId));
        const defaultMusic = musicList.find((music) => music.id === Number.parseInt(musicId || '')) || null;
        setSelectedMusic(defaultMusic);
      }
      if (musicDifficulty) {
        setValue('musicDifficulty', musicDifficulty);
      }
    } catch (err) {
      console.log(err);
      showToast('error', '楽曲情報の取得に失敗しました。');
    } finally {
      if (loadingToastId) {
        toast.dismiss(loadingToastId);
        loadingToastId = null;
      }
    }
  };

  useEffect(() => {
    getAllMusic();
    setMusicDifficulty();
  }, [currentGenre]);

  const setMusicDifficulty = () => {
    if (currentGenre === 1) {
      setDifficultyList(['easy', 'normal', 'hard', 'expert', 'master', 'append']);
    } else if (currentGenre === 2) {
      setDifficultyList(['normal', 'hard', 'extra', 'stella', 'olivier']);
    }
  };

  const watchMusic = watch(['musicId', 'musicDifficulty']);

  useEffect(() => {
    if (watchMusic[0] && watchMusic[1]) {
      const musicId = watchMusic[0];
      const musicDifficulty = watchMusic[1];
      const data = musicList
        .flatMap((music: MusicType) => music.metaMusic as unknown as MetaMusicType[])
        .filter((meta: MetaMusicType) => musicId == meta.musicId && musicDifficulty == meta.musicDifficulty);
      if (data[0]) {
        setValue('totalNoteCount', data[0].totalNoteCount);
      } else {
        setValue('totalNoteCount', NaN);
      }
    }
  }, [watchMusic, musicList, setValue]);

  const watchedScores = getValues(['perfectCount', 'greatCount', 'goodCount', 'badCount', 'missCount']);
  const watchedScores2 = getValues([
    'perfectPlusCount',
    'perfectCount',
    'greatCount',
    'goodCount',
    'badCount',
    'missCount',
  ]);
  const watchedPerfectPlusCount = watch('perfectPlusCount');
  const watchedPerfectCount = watch('perfectCount');
  const watchedGreatCount = watch('greatCount');
  const watchedGoodCount = watch('goodCount');
  const watchedBadCount = watch('badCount');
  const watchedMissCount = watch('missCount');
  const watchedTotalNoteCount = getValues('totalNoteCount');

  //テキストフィールドからフォーカスが外れた際にスコア補完機能が働く
  const onBlurScoreCompletion = () => {
    if (currentGenre === 1) {
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

      const remainNoteCount = watchedTotalNoteCount - count;
      if (filledFields == 1) {
        watchedScores.forEach((score, idx) => {
          if (Number.isNaN(score) && idx == 0) {
            setValue('perfectCount', remainNoteCount);
          }
          if (Number.isNaN(score) && idx == 1) {
            setValue('greatCount', remainNoteCount);
          }
          if (Number.isNaN(score) && idx == 2) {
            setValue('goodCount', remainNoteCount);
          }
          if (Number.isNaN(score) && idx == 3) {
            setValue('badCount', remainNoteCount);
          }
          if (Number.isNaN(score) && idx == 4) {
            setValue('missCount', remainNoteCount);
          }
        });
      }
      //フルコンボまたはAP用のスコア補完機能
      else if (remainNoteCount === 0) {
        watchedScores.forEach((score, idx) => {
          if (Number.isNaN(score) && idx == 0) {
            setValue('perfectCount', 0);
          }
          if (Number.isNaN(score) && idx == 1) {
            setValue('greatCount', 0);
          }
          if (Number.isNaN(score) && idx == 2) {
            setValue('goodCount', 0);
          }
          if (Number.isNaN(score) && idx == 3) {
            setValue('badCount', 0);
          }
          if (Number.isNaN(score) && idx == 4) {
            setValue('missCount', 0);
          }
        });
      }
    } else if (currentGenre === 2) {
      const filledFields = Object.values([
        watchedPerfectPlusCount,
        watchedPerfectCount,
        watchedGreatCount,
        watchedGoodCount,
        watchedBadCount,
        watchedMissCount,
      ]).filter((val) => Number.isNaN(val)).length;
      const count = watchedScores2.reduce((accumulator, currentValue) => {
        const numericValue = Number(currentValue);
        return (accumulator ?? 0) + (Number.isNaN(numericValue) ? 0 : numericValue);
      }, 0);

      const remainNoteCount = watchedTotalNoteCount - (count ?? 0);

      if (filledFields == 1) {
        watchedScores2.forEach((score, idx) => {
          if (Number.isNaN(score) && idx == 0) {
            setValue('perfectPlusCount', remainNoteCount);
          }
          if (Number.isNaN(score) && idx == 1) {
            setValue('perfectCount', remainNoteCount);
          }
          if (Number.isNaN(score) && idx == 2) {
            setValue('greatCount', remainNoteCount);
          }
          if (Number.isNaN(score) && idx == 3) {
            setValue('goodCount', remainNoteCount);
          }
          if (Number.isNaN(score) && idx == 4) {
            setValue('badCount', remainNoteCount);
          }
          if (Number.isNaN(score) && idx == 5) {
            setValue('missCount', remainNoteCount);
          }
        });
      }
      //フルコンボまたはAP用のスコア補完機能
      else if (remainNoteCount === 0) {
        watchedScores2.forEach((score, idx) => {
          if (Number.isNaN(score) && idx == 0) {
            setValue('perfectPlusCount', 0);
          }
          if (Number.isNaN(score) && idx == 1) {
            setValue('perfectCount', 0);
          }
          if (Number.isNaN(score) && idx == 2) {
            setValue('greatCount', 0);
          }
          if (Number.isNaN(score) && idx == 3) {
            setValue('goodCount', 0);
          }
          if (Number.isNaN(score) && idx == 4) {
            setValue('badCount', 0);
          }
          if (Number.isNaN(score) && idx == 5) {
            setValue('missCount', 0);
          }
        });
      }
    }
  };

  const handleMusicChange = (_: React.SyntheticEvent, newValue: MusicType | null) => {
    setSelectedMusic(newValue);
    setValue('musicId', newValue ? newValue.id : 0);
  };

  const onClickFullComb = () => {
    setValue('goodCount', 0);
    setValue('badCount', 0);
    setValue('missCount', 0);
  };

  const onClickAllPerfect = () => {
    setValue('perfectCount', watchedTotalNoteCount);
    setValue('greatCount', 0);
    setValue('goodCount', 0);
    setValue('badCount', 0);
    setValue('missCount', 0);
  };

  const onClickFillOutZero = () => {
    const filledFields = Object.values([
      watchedPerfectPlusCount,
      watchedPerfectCount,
      watchedGreatCount,
      watchedGoodCount,
      watchedBadCount,
      watchedMissCount,
    ]);
    filledFields.forEach((field, idx: number) => {
      if (Number.isNaN(field) && idx === 2) {
        setValue('greatCount', 0);
      }
      if (Number.isNaN(field) && idx === 3) {
        setValue('goodCount', 0);
      }
      if (Number.isNaN(field) && idx === 4) {
        setValue('badCount', 0);
      }
      if (Number.isNaN(field) && idx === 5) {
        setValue('missCount', 0);
      }
    });
  };

  const onClickResetScore = () => {
    setValue('perfectPlusCount', NaN);
    setValue('perfectCount', NaN);
    setValue('greatCount', NaN);
    setValue('goodCount', NaN);
    setValue('badCount', NaN);
    setValue('missCount', NaN);
  };

  const CustomToastWithLink = (newScore: ScoreType) => (
    <div>
      <Button>
        <TwitterIntentTweet
          className='share-button'
          text={`ベストスコアを更新しました!\n${newScore?.musicName}(${newScore?.musicDifficulty})\n${newScore?.totalNoteCount}\nPerfectPlusCount:${newScore?.perfectPlusCount}\nPerfectCount:${newScore?.perfectCount}\nGreatCount:${newScore?.greatCount}\nGoodCount:${newScore?.goodCount}\nBadCount:${newScore?.badCount}\nMissCount${newScore?.missCount}`}
          hashtags={['MyApp']}
        >
          Xにシェアする
        </TwitterIntentTweet>
      </Button>
    </div>
  );

  const onSubmit = async (values: FormData) => {
    try {
      const response = await axiosClient.post(`${import.meta.env.VITE_APP_URL}/scores`, {
        ...values,
        genreId: currentGenre || 1,
        userId: user?.id,
        sortId: 0,
      });
      showToast('success', `スコアの${scoreId != undefined ? '更新' : '登録'}に成功しました。`);
      if (!scoreId) {
        reset({
          musicId: registerConsecutively ? values.musicId : 0,
          totalNoteCount: registerConsecutively ? values.totalNoteCount : NaN,
          perfectPlusCount: NaN,
          perfectCount: NaN,
          greatCount: NaN,
          goodCount: NaN,
          badCount: NaN,
          missCount: NaN,
        });
      }
      console.log(response.data);
      const newScore: ScoreType = response.data.newScore as ScoreType;
      if (response.data.isBestScore) {
        showToast('success', 'ベストスコア更新しました!');
        toast.info(<CustomToastWithLink {...newScore} />);
      }
    } catch (err) {
      console.log(err);
      showToast('error', `スコアの${scoreId != undefined ? '更新' : '登録'}に失敗しました。`);
    }
  };

  type TwitterIntentTweetProps = {
    text?: string;
    url?: string;
    hashtags?: string[];
    via?: string;
    related?: string[];
    in_reply_to?: string;
  } & Omit<ComponentProps<'a'>, 'href' | 'target' | 'rel'>;

  const TwitterIntentTweet = forwardRef<HTMLAnchorElement, TwitterIntentTweetProps>(
    ({ text, url, hashtags, via, related, in_reply_to, ...intrinsicProps }, forwardedRef) => {
      const _url = new URL('https://twitter.com/intent/tweet');

      if (text !== undefined) _url.searchParams.set('text', text);
      if (url !== undefined) _url.searchParams.set('url', url);
      if (hashtags !== undefined) _url.searchParams.set('hashtags', hashtags.join(','));
      if (via !== undefined) _url.searchParams.set('via', via);
      if (related !== undefined) _url.searchParams.set('related', related.join(','));
      if (in_reply_to !== undefined) _url.searchParams.set('in_reply_to', in_reply_to);

      return (
        <a ref={forwardedRef} href={_url.toString()} target='_blank' rel='noopener noreferrer' {...intrinsicProps} />
      );
    },
  );

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
            <input type='hidden' value={scoreId} {...register('scoreId', { required: false })} />
            <div>
              <Autocomplete
                disablePortal
                id='search-music-autocomplete'
                options={musicList}
                value={selectedMusic}
                getOptionLabel={(option: MusicType) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => <TextField {...params} label='楽曲検索' />}
                onChange={handleMusicChange}
                disabled={scoreId != undefined}
                className='mb-4'
              />
              <input type='hidden' {...register('musicId', { required: true, valueAsNumber: true })} />
            </div>
            {errors.musicId && <span className='text-red-500 mb-2 block'>{errors.musicId.message}</span>}
            <select
              {...register('musicDifficulty', { required: true })}
              className='mb-4 p-2 rounded border border-gray-300 w-full'
              disabled={scoreId != undefined}
            >
              {difficultyList.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
            {errors.totalNoteCount && <span className='text-red-500 mb-2 block'>{errors.totalNoteCount.message}</span>}
            <input
              {...register('totalNoteCount')}
              type='number'
              disabled
              className='mb-4 p-2 rounded border border-gray-300 w-full'
            />
            {currentGenre === 2 && (
              <>
                <input
                  {...register('perfectPlusCount', { required: true, valueAsNumber: true })}
                  type='number'
                  placeholder='PerfectPlus'
                  min={0}
                  onBlur={onBlurScoreCompletion}
                  className='mb-4 p-2 rounded border border-gray-300 w-full'
                />
                {errors.perfectPlusCount && (
                  <span className='text-red-500 mb-2 block'>{errors.perfectPlusCount.message}</span>
                )}
              </>
            )}
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
            <div className='flex items-center gap-x-2'>
              <Button variant='contained' type='submit' disabled={formState.isSubmitting}>
                スコアを登録する
              </Button>
              <Button
                variant='contained'
                color='success'
                type='button'
                disabled={formState.isSubmitting || selectedMusic == null}
                onClick={onClickFullComb}
              >
                フルコンボ
              </Button>
              <Button
                variant='contained'
                color='warning'
                type='button'
                disabled={formState.isSubmitting || selectedMusic == null}
                onClick={onClickAllPerfect}
              >
                All Perfect
              </Button>
              <Button
                variant='contained'
                color='secondary'
                type='button'
                disabled={formState.isSubmitting || selectedMusic == null}
                onClick={onClickFillOutZero}
              >
                0埋め(Perfectを除く)
              </Button>
              <Button
                variant='contained'
                color='error'
                type='button'
                disabled={formState.isSubmitting || selectedMusic == null}
                onClick={onClickResetScore}
              >
                リセット
              </Button>
              <FormGroup className='mx-5'>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={registerConsecutively}
                      onChange={() => setRegisterConsecutively((prev) => !prev)}
                      disabled={formState.isSubmitting}
                    />
                  }
                  label='同じ曲を連続で登録する'
                />
              </FormGroup>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default RegisterMusicScore;
