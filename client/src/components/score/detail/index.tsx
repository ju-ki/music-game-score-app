import { useEffect, useState } from 'react';
import Sidebar from '../../common/Sidebar';
import Header from '../../common/Header';
import axiosClient from '../../../utils/axios';
import { useUserStore } from '../../store/userStore';
import { useParams } from 'react-router-dom';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { EmojiEmotions, EmojiEventsTwoTone, InsertEmoticon, Whatshot } from '@mui/icons-material';
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
  return (
    <div className='flex h-screen'>
      <div className='flex-initial w-1/5'>
        <Sidebar />
      </div>

      <div className='flex-auto w-4/5'>
        <Header />
        <main className='p-4'>
          <h1>
            {music}
            {musicDifficulty}スコア一覧
          </h1>
          <Grid container spacing={2}>
            {scoreList.length > 0 ? (
              scoreList.map((score: ScoreType, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  {score.goodCount === 0 && score.badCount === 0 && score.missCount === 0 ? (
                    <Card variant='outlined' sx={{ backgroundColor: '#ffd700' }}>
                      <CardContent>
                        <Box display='flex' alignItems='center' mb={1}>
                          <Whatshot color='error' />
                          <Typography variant='h6' component='div' ml={1}>
                            Full Combo!
                          </Typography>
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
                        <Box display='flex' alignItems='center' mb={1}>
                          {index === 0 && <EmojiEventsTwoTone color='primary' />}
                          {index === 1 && <EmojiEmotions color='secondary' />}
                          {index === 2 && <InsertEmoticon color='action' />}
                          <Typography variant='h6' component='div' ml={1}>
                            Rank {index + 1}
                          </Typography>
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
