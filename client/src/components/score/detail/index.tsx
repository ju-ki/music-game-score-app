import { useEffect, useState } from 'react';
import Sidebar from '../../common/Sidebar';
import Header from '../../common/Header';
import axiosClient from '../../../utils/axios';
import { useUserStore } from '../../store/userStore';
import { NavLink, useParams } from 'react-router-dom';
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { Delete, EmojiEmotions, EmojiEventsTwoTone, InsertEmoticon, Whatshot } from '@mui/icons-material';
import { ScoreType } from '../../../types/score';

const MusicScoreList = () => {
  const { musicId, musicDifficulty } = useParams();
  const { user } = useUserStore();
  const [music, setMusic] = useState('');
  const [scoreList, setScoreList] = useState([]);
  useEffect(() => {
    getScoreList();
  }, []);
  async function getScoreList() {
    try {
      const response = await axiosClient.get(`${import.meta.env.VITE_APP_URL}scores/detailList`, {
        params: {
          userId: user?.id,
          genreId: 1,
          musicId: musicId,
          musicDifficulty: musicDifficulty,
        },
      });
      setMusic(response.data.music.name);
      setScoreList(response.data.scoreList);
    } catch (err) {
      console.log(err);
    }
  }

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
  return (
    <div className='flex h-screen'>
      <div className='flex-initial w-1/5'>
        <Sidebar />
      </div>

      <div className='flex-auto w-4/5'>
        <Header />
        <main className='p-4'>
          <div className='flex items-center justify-between my-10'>
            <h1 className='text-2xl'>
              {music}({musicDifficulty})<span className='mx-3'>スコア一覧</span>
            </h1>
            <div className='px-5'>
              <NavLink to={`/register-music-score/${musicId}/${musicDifficulty}`} style={{ display: 'block' }}>
                <Button color='primary' variant='contained'>
                  スコアを登録する
                </Button>
              </NavLink>
            </div>
          </div>
          <Grid container spacing={2}>
            {scoreList.length > 0 ? (
              scoreList.map((score: ScoreType, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  {score.goodCount === 0 && score.badCount === 0 && score.missCount === 0 ? (
                    <Card variant='outlined' sx={{ backgroundColor: '#ffd700' }}>
                      <CardContent>
                        <Box display='flex' alignItems='center' mb={1} justifyContent={'space-between'}>
                          <div className='flex items-center'>
                            <Whatshot color='error' />
                            <Typography variant='h6' component='div' ml={1}>
                              Full Combo!
                            </Typography>
                          </div>
                          <Delete color='error' onClick={() => DeleteScore(score.id)} />
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
                    <Card>
                      <CardContent>
                        <Box display='flex' alignItems='center' justifyContent={'space-between'} mb={1}>
                          <div className='flex items-center'>
                            {index === 0 && <EmojiEventsTwoTone color='primary' />}
                            {index === 1 && <EmojiEmotions color='secondary' />}
                            {index === 2 && <InsertEmoticon color='action' />}
                            <Typography variant='h6' component='div' ml={1}>
                              Rank {index + 1}
                            </Typography>
                          </div>
                          <Delete color='error' onClick={() => DeleteScore(score.id)} />
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
                No scores available.
              </Typography>
            )}
          </Grid>
        </main>
      </div>
    </div>
  );
};

export default MusicScoreList;
