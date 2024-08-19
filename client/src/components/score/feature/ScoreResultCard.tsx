import { Box, Card, CardContent, Typography } from '@mui/material';
import { ScoreType } from '../../../types/score';
import { Delete, Edit, EmojiEmotions, EmojiEventsTwoTone, InsertEmoticon, Whatshot } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { deleteScore } from '../../../services/score/api';
import { useUserStore } from '../../store/userStore';
import { useGenre } from '../../store/useGenre';
import { RainbowStar } from './RainbowStar';

const ScoreResultCard = (params: { score: ScoreType; index: number }) => {
  const { score, index } = params;
  const { user } = useUserStore();
  const { currentGenre } = useGenre();
  const navigate = useNavigate();
  const isAllPerfect: boolean =
    (currentGenre === 1 && score.perfectCount === score.totalNoteCount) ||
    (currentGenre === 2 && (score.perfectPlusCount || 0) + score.perfectCount === score.totalNoteCount);
  const isFullComb: boolean =
    (currentGenre === 1 && score.perfectCount + score.greatCount === score.totalNoteCount) ||
    (currentGenre === 2 &&
      (score.perfectPlusCount || 0) + score.perfectCount + score.greatCount === score.totalNoteCount);

  const commonCardStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };
  return (
    <>
      <Card
        sx={{
          ...commonCardStyle,
          ...(isFullComb ? { backgroundColor: '#ffd700' } : {}),
        }}
        className={isAllPerfect ? 'bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-200' : ''}
      >
        <CardContent>
          <Box display='flex' alignItems='center' justifyContent='space-between' mb={1}>
            <div className='flex items-center'>
              {isAllPerfect ? (
                <>
                  <RainbowStar />
                  <Typography variant='h6' component='div' ml={1}>
                    All Perfect <span>({new Date(score.createdAt).toLocaleDateString('sv-SE')})</span>
                  </Typography>
                </>
              ) : isFullComb ? (
                <>
                  <Whatshot color={'error'} />
                  <Typography variant='h6' component='div' ml={1}>
                    Full Comb <span>({new Date(score.createdAt).toLocaleDateString('sv-SE')})</span>
                  </Typography>
                </>
              ) : (
                <>
                  {index === 0 && <EmojiEventsTwoTone color='primary' />}
                  {index === 1 && <EmojiEmotions color='secondary' />}
                  {index === 2 && <InsertEmoticon color='action' />}
                  <Typography variant='h6' component='div' ml={1}>
                    Rank {index + 1} <span>({new Date(score.createdAt).toLocaleDateString('sv-SE')})</span>
                  </Typography>
                </>
              )}
            </div>
            <div className='space-x-2'>
              <Edit onClick={() => navigate(`/edit-score/${score.id}`)} />
              <Delete color='error' onClick={() => deleteScore({ userId: user?.id, scoreId: score.id })} />
            </div>
          </Box>
          <Typography variant='body2' component='div' mb={1}>
            Total Note Count: {score.totalNoteCount}
          </Typography>
          {currentGenre === 2 && (
            <Typography variant='body2' component='div' mb={1}>
              PerfectPlus: {score.perfectPlusCount}
            </Typography>
          )}
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
    </>
  );
};

export default ScoreResultCard;
