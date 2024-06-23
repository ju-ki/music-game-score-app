import { useState } from 'react';
import Sidebar from '../../common/Sidebar';
import Header from '../../common/Header';
import { NavLink, useParams } from 'react-router-dom';
import { Button, FormControl, Grid, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { useFetchScoreList } from '../../hooks/useScoreList';
import { useScoreCount } from '../../../services/score/calc';
import ScoreResultCard from '../feature/ScoreResultCard';
import ScoreResultOverview from '../feature/ScoreResultOverview';
const MusicScoreList = () => {
  const { musicId, musicDifficulty } = useParams();
  const [sortId, setSortId] = useState<number>(0);
  const { scoreList, musicName, bestScore, isLoading } = useFetchScoreList(sortId);
  const { countPlayCount, countFullCombCount, countAllPerfectCount } = useScoreCount(scoreList);

  const handleChangeSortId = (event: SelectChangeEvent<number>) => {
    setSortId(event.target.value as number);
  };

  if (isLoading) {
    return;
  }
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
                {musicName}({musicDifficulty})<span className='mx-3'>スコア一覧</span>
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
          <ScoreResultOverview
            bestScore={bestScore}
            countPlayCount={countPlayCount}
            countFullCombCount={countFullCombCount}
            countAllPerfectCount={countAllPerfectCount}
          />
          <Grid container spacing={2}>
            {scoreList.length > 0 ? (
              scoreList.map((score, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <ScoreResultCard score={score} index={index} />
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
