import { NavLink } from 'react-router-dom';
import Header from '../../common/Header';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { fetchMusicList } from '../../hooks/useMusicQuery';
import { useEffect, useState } from 'react';
import { MusicType, UnitType } from '../../../types/score';

const AdminMusic = () => {
  const [musicList, setMusicList] = useState<MusicType[]>([]);
  const [unitList, setUnitList] = useState<UnitType[]>([]);
  useEffect(() => {
    getMusic();
  }, []);

  const getMusic = async () => {
    try {
      const response = await fetchMusicList(0, false);
      setMusicList(response.items);
      setUnitList(response.unitProfile);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className='flex flex-col min-h-screen'>
        <Header />
        <div className='flex-grow container mx-auto px-4 py-8'>
          <div className='flex space-x-4 mb-6'>
            <NavLink to={'/'}>
              <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                トップページへ
              </Typography>
            </NavLink>
            <NavLink to={'/admin'}>
              <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                管理者トップページへ
              </Typography>
            </NavLink>
          </div>

          <form>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '50px' }}>ID</TableCell>
                    <TableCell>曲名</TableCell>
                    <TableCell>譜面情報</TableCell>
                    <TableCell>ユニット情報</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {musicList.map((music, idx) => (
                    <TableRow key={idx + 1}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{music.name}</TableCell>
                      <TableCell>
                        {music.metaMusic.map((meta) => (
                          <div key={meta.id}>
                            {meta.musicDifficulty}({meta.playLevel}) : {meta.totalNoteCount}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {music.musicTag.map((tag) =>
                          unitList.map((unit: UnitType) => {
                            const adjustedUnitName =
                              unit.unitName === 'piapro'
                                ? 'vocaloid'
                                : unit.unitName === 'light_sound'
                                  ? 'light_music_club'
                                  : unit.unitName;
                            return (
                              adjustedUnitName === tag.tagName && (
                                <div key={unit.seq}>
                                  {unit.unitProfileName} ({unit.seq})
                                </div>
                              )
                            );
                          }),
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminMusic;
