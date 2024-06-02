import { useEffect, useState } from 'react';
import Sidebar from '../../common/Sidebar';
import Header from '../../common/Header';
import axiosClient from '../../../utils/axios';
import { useUserStore } from '../../store/userStore';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { Delete, Edit, EmojiEmotions, EmojiEventsTwoTone, InsertEmoticon, Whatshot } from '@mui/icons-material';
import { BestScoreType, ScoreType } from '../../../types/score';
import { Divider } from '@mui/joy';

const MusicScoreList = () => {
  const commonCardStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const RainbowStar = ({ size = 24 }) => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={size} height={size} className='rainbow-star'>
      <path
        d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
        fill='none'
        stroke='url(#rainbow-gradient)'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <defs>
        <linearGradient id='rainbow-gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
          <stop offset='0%' stopColor='#ff0000' />
          <stop offset='16.67%' stopColor='#ffff00' />
          <stop offset='33.33%' stopColor='#00ff00' />
          <stop offset='50%' stopColor='#00ffff' />
          <stop offset='66.67%' stopColor='#0000ff' />
          <stop offset='83.33%' stopColor='#ff00ff' />
          <stop offset='100%' stopColor='#ff0000' />
        </linearGradient>
      </defs>
    </svg>
  );

  const { musicId, musicDifficulty } = useParams();
  const { user } = useUserStore();
  const [music, setMusic] = useState('');
  const [scoreList, setScoreList] = useState<ScoreType[]>([]);
  const [bestScore, setBestScore] = useState<BestScoreType>();
  const [sortId, setSortId] = useState<number>(0);
  const [countPlayCount, setPlayCount] = useState<number>(0);
  const [countFullComb, setCountFullComb] = useState<number>(0);
  const [countAllPerfectCount, setCountAllPerfectCount] = useState<number>(0);

  const navigate = useNavigate();
  useEffect(() => {
    getScoreList();
  }, [sortId]);
  async function getScoreList() {
    try {
      const response = await axiosClient.get(`${import.meta.env.VITE_APP_URL}scores/detailList`, {
        params: {
          userId: user?.id,
          genreId: 1,
          musicId: musicId,
          musicDifficulty: musicDifficulty,
          sortId: sortId,
        },
      });

      setScoreList(response.data.scoreList);
      setBestScore(response.data.bestScore);
      CountFullCombOrAllPerfectCount(response.data.scoreList);
      setMusic(response.data.music.name);
      setScoreList(response.data.scoreList);
      setBestScore(response.data.bestScore);
      CountFullCombOrAllPerfectCount(response.data.scoreList);
    } catch (err) {
      console.log(err);
    }
  }

  const CountFullCombOrAllPerfectCount = (scoreList: ScoreType[]) => {
    setCountFullComb(0);
    setCountAllPerfectCount(0);
    setPlayCount(0);
    scoreList.forEach((score) => {
      if (score.perfectCount === score.totalNoteCount) {
        setCountAllPerfectCount((prev) => prev + 1);
      }

      if (score.perfectCount + score.greatCount === score.totalNoteCount) {
        setCountFullComb((prev) => prev + 1);
      }
      setPlayCount((prev) => prev + 1);
    });
  };

  const EditScore = async (scoreId: string) => {
    navigate(`/edit-score/${scoreId}`);
  };

  const DeleteScore = async (scoreId: string) => {
    if (confirm('削除してもよろしいですか?')) {
      try {
        await axiosClient.delete(`${import.meta.env.VITE_APP_URL}scores`, {
          params: {
            userId: user?.id,
            scoreId: scoreId,
          },
        });

        alert('削除に成功しました');
      } catch (err) {
        console.log(err);
        //後にエラー文言の出し方を修正する
        alert('削除に失敗しました');
      }
    }
  };

  const handleChangeSortId = (event: SelectChangeEvent<number>) => {
    setSortId(event.target.value as number);
  };
  return (
    <div className='flex h-screen'>
      <div className='flex-initial w-1/5'>
        <Sidebar />
      </div>

      <div className='flex-auto w-4/5'>
        <Header />
        <main className='p-4'>
          <div className='flex items-center justify-between my-10'>
            <div className='flex items-center space-x-5'>
              <div className='text-2xl'>
                {music}({musicDifficulty})<span className='mx-3'>スコア一覧</span>
              </div>
              <FormControl>
                <Select
                  labelId='score-sort-label'
                  id='score-sort-id'
                  value={sortId}
                  type='number'
                  onChange={handleChangeSortId}
                >
                  <MenuItem value={0}>ミス数順</MenuItem>
                  <MenuItem value={1}>失点順</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className='px-5'>
              <NavLink to={`/register-music-score/${musicId}/${musicDifficulty}`} style={{ display: 'block' }}>
                <Button color='primary' variant='contained'>
                  スコアを登録する
                </Button>
              </NavLink>
            </div>
          </div>
          <Box my={4} mx='auto'>
            <Grid container spacing={4} justifyContent='center'>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box display='flex' justifyContent='space-around' alignItems='center' flexWrap='nowrap'>
                      <Box display='flex' alignItems='center'>
                        <div>
                          <Typography variant='h6' component='h2' align='center'>
                            プレイ回数
                          </Typography>
                          <Typography variant='h4' component='div' align='center' fontWeight='bold'>
                            {countPlayCount}
                          </Typography>
                        </div>
                      </Box>
                      <Divider orientation='vertical' />
                      <Box display='flex' alignItems='center'>
                        <div>
                          <Typography variant='h6' component='h2' align='center'>
                            FullCombカウント
                          </Typography>
                          <Typography variant='h4' component='div' align='center' fontWeight='bold'>
                            {countFullComb}
                          </Typography>
                        </div>
                      </Box>
                      <Divider orientation='vertical' />
                      <Box display='flex' alignItems='center'>
                        <div>
                          <Typography variant='h6' component='h2' align='center'>
                            APカウント
                          </Typography>
                          <Typography variant='h4' component='div' align='center' fontWeight='bold'>
                            {countAllPerfectCount}
                          </Typography>
                        </div>
                      </Box>
                      <Divider orientation='vertical' />
                      <Box display='flex' flexDirection='column' alignItems='center'>
                        <Typography variant='h6' component='h2' align='center'>
                          今日のベストスコア
                        </Typography>
                        {bestScore?.today ? (
                          <>
                            <Typography variant='body2' component='div' mb={1}>
                              Perfect: {bestScore.today.perfectCount}
                            </Typography>
                            <Typography variant='body2' component='div' mb={1}>
                              Great: {bestScore.today.greatCount}
                            </Typography>
                            <Typography variant='body2' component='div' mb={1}>
                              Good: {bestScore.today.goodCount}
                            </Typography>
                            <Typography variant='body2' component='div' mb={1}>
                              Bad: {bestScore.today.badCount}
                            </Typography>
                            <Typography variant='body2' component='div'>
                              Miss: {bestScore.today.missCount}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant='body2' align='center'>
                            登録されていません
                          </Typography>
                        )}
                      </Box>
                      <Divider orientation='vertical' />
                      <Box display='flex' flexDirection='column' alignItems='center'>
                        <Typography variant='h6' component='h2' align='center'>
                          今週のベストスコア
                        </Typography>
                        {bestScore?.week ? (
                          <>
                            <Typography variant='body2' component='div' mb={1}>
                              Perfect: {bestScore.week.perfectCount}
                            </Typography>
                            <Typography variant='body2' component='div' mb={1}>
                              Great: {bestScore.week.greatCount}
                            </Typography>
                            <Typography variant='body2' component='div' mb={1}>
                              Good: {bestScore.week.goodCount}
                            </Typography>
                            <Typography variant='body2' component='div' mb={1}>
                              Bad: {bestScore.week.badCount}
                            </Typography>
                            <Typography variant='body2' component='div'>
                              Miss: {bestScore.week.missCount}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant='body2' align='center'>
                            登録されていません
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          <Grid container spacing={2}>
            {scoreList.length > 0 ? (
              scoreList.map((score, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  {score.perfectCount === score.totalNoteCount ? (
                    <Card
                      variant='outlined'
                      sx={{ ...commonCardStyle }}
                      className='bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-200'
                    >
                      <CardContent>
                        <Box display='flex' alignItems='center' mb={1} justifyContent='space-between'>
                          <div className='flex items-center'>
                            <RainbowStar />
                            <Typography variant='h5' component='div' ml={1}>
                              All Perfect!
                            </Typography>
                          </div>
                          <div className='space-x-2'>
                            <Edit onClick={() => EditScore(score.id)} />
                            <Delete color='error' onClick={() => DeleteScore(score.id)} />
                          </div>
                        </Box>
                        <Typography variant='body2' component='div' mb={1}>
                          Total Note Count: {score.totalNoteCount}
                        </Typography>
                        <Typography variant='body2' component='div' mb={1}>
                          Perfect: {score.perfectCount}
                        </Typography>
                        <Typography variant='body2' component='div' mb={1}>
                          Great: {score.greatCount}
                        </Typography>
                      </CardContent>
                    </Card>
                  ) : score.goodCount === 0 && score.badCount === 0 && score.missCount === 0 ? (
                    <Card variant='outlined' sx={{ ...commonCardStyle, backgroundColor: '#ffd700' }}>
                      <CardContent>
                        <Box display='flex' alignItems='center' mb={1} justifyContent='space-between'>
                          <div className='flex items-center'>
                            <Whatshot color='error' />
                            <Typography variant='h6' component='div' ml={1}>
                              Full Combo!
                            </Typography>
                          </div>
                          <div className='space-x-2'>
                            <Edit onClick={() => EditScore(score.id)} />
                            <Delete color='error' onClick={() => DeleteScore(score.id)} />
                          </div>
                        </Box>
                        <Typography variant='body2' component='div' mb={1}>
                          Total Note Count: {score.totalNoteCount}
                        </Typography>
                        <Typography variant='body2' component='div' mb={1}>
                          Perfect: {score.perfectCount}
                        </Typography>
                        <Typography variant='body2' component='div' mb={1}>
                          Great: {score.greatCount}
                        </Typography>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card sx={commonCardStyle}>
                      <CardContent>
                        <Box display='flex' alignItems='center' justifyContent='space-between' mb={1}>
                          <div className='flex items-center'>
                            {index === 0 && <EmojiEventsTwoTone color='primary' />}
                            {index === 1 && <EmojiEmotions color='secondary' />}
                            {index === 2 && <InsertEmoticon color='action' />}
                            <Typography variant='h6' component='div' ml={1}>
                              Rank {index + 1}
                            </Typography>
                          </div>
                          <div className='space-x-2'>
                            <Edit onClick={() => EditScore(score.id)} />
                            <Delete color='error' onClick={() => DeleteScore(score.id)} />
                          </div>
                        </Box>
                        <Typography variant='body2' component='div' mb={1}>
                          Total Note Count: {score.totalNoteCount}
                        </Typography>
                        <Typography variant='body2' component='div' mb={1}>
                          Perfect: {score.perfectCount}
                        </Typography>
                        <Typography variant='body2' component='div' mb={1}>
                          Great: {score.greatCount}
                        </Typography>
                        <Typography variant='body2' component='div' mb={1}>
                          Good: {score.goodCount}
                        </Typography>
                        <Typography variant='body2' component='div' mb={1}>
                          Bad: {score.badCount}
                        </Typography>
                        <Typography variant='body2' component='div'>
                          Miss: {score.missCount}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Grid>
              ))
            ) : (
              <Typography variant='h6' component='div'>
                スコアの登録がありません。スコアを登録しましょう!
              </Typography>
            )}
          </Grid>
        </main>
      </div>
    </div>
  );
};

export default MusicScoreList;
