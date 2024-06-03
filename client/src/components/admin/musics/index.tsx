import { NavLink } from 'react-router-dom';
import Header from '../../common/Header';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { fetchMusicList } from '../../hooks/useMusicQuery';
import { useEffect, useState } from 'react';
import { MusicType, UnitType } from '../../../types/score';
import axiosClient from '../../../utils/axios';

const AdminMusic = () => {
  const [musicList, setMusicList] = useState<MusicType[]>([]);
  const [unitList, setUnitList] = useState<UnitType[]>([]);
  const [newSongs, setNewSongs] = useState<{ title: string; id: number }[]>([]);
  const [open, setOpen] = useState(false);
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

  const updateMusic = async () => {
    try {
      const response = await axiosClient.get(`${import.meta.env.VITE_APP_URL}songs`);
      console.log(response.data);
      setMusicList(response.data.allMusic.items);
      const newSongs = response.data.newMusic; // ここで新しく取得した曲を設定
      setNewSongs(newSongs);
      setOpen(true);
    } catch (err) {
      alert('失敗しました.');
      console.log(err);
    }
  };

  const handleClose = () => {
    setOpen(false);
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
            <Button variant='contained' onClick={updateMusic}>
              楽曲の更新を行う
            </Button>
          </div>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>新しい曲が追加されました</DialogTitle>
            <DialogContent>
              {newSongs.map((song) => (
                <Typography key={song.id}>{song.title}</Typography>
              ))}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color='primary'>
                閉じる
              </Button>
            </DialogActions>
          </Dialog>

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
