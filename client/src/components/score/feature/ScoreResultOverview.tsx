import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { Divider } from '@mui/joy';
import { BestScoreType } from '../../../types/score';

const ScoreResultOverview = (params: {
  bestScore: BestScoreType | undefined;
  countPlayCount: number;
  countFullCombCount: number;
  countAllPerfectCount: number;
}) => {
  const { bestScore, countPlayCount, countFullCombCount, countAllPerfectCount } = params;
  return (
    <>
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
                        {countFullCombCount}
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
    </>
  );
};

export default ScoreResultOverview;
