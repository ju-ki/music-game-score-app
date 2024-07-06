import { NavLink } from 'react-router-dom';
import Header from '../../common/Header';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { fetchMusicList } from '../../hooks/useMusicQuery';
import React, { useEffect, useState } from 'react';
import { MetaMusicType, MusicType, UnitType } from '../../../types/score';
import axiosClient from '../../../utils/axios';
import { useGenre } from '../../store/useGenre';
import useFetchGenres from '../../hooks/useFetchGenres';
import { showToast } from '../../common/Toast';

const AdminMusic = () => {
  useFetchGenres();
  const [musicList, setMusicList] = useState<MusicType[]>([]);
  const [unitList, setUnitList] = useState<UnitType[]>([]);
  const [changedMetaMusic, setChangedMetaMusic] = useState<MetaMusicType[]>([]);
  const [newSongs, setNewSongs] = useState<{ title: string; id: number }[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const { currentGenre, genres, setCurrentGenre } = useGenre();
  useEffect(() => {
    getMusic();
  }, [currentGenre]);

  const getMusic = async () => {
    try {
      const response = await fetchMusicList(0, false, currentGenre);
      setMusicList(response.items);
      console.log(response.items);
      setUnitList(response.unitProfile);
    } catch (err) {
      showToast('error', '楽曲情報の取得に失敗しました');
      console.log(err);
    }
  };

  const updateMusic = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get(`${import.meta.env.VITE_APP_URL}/songs`, {
        params: { genreId: currentGenre },
      });
      setMusicList(response.data.allMusic.items);
      const newSongs = response.data.newMusic; // ここで新しく取得した曲を設定
      setNewSongs(newSongs);
      setOpen(true);
      showToast('success', '楽曲情報の更新に成功しました');
    } catch (err) {
      showToast('error', '楽曲情報の更新に失敗しました');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const editMusicInfo = async () => {
    if (changedMetaMusic.length > 0) {
      setLoading(true);
      try {
        const response = await axiosClient.patch(`${import.meta.env.VITE_APP_URL}/songs`, {
          genreId: currentGenre,
          metaMusic: changedMetaMusic,
        });
        setMusicList(response.data.items);
        showToast('success', '楽曲情報の更新に成功しました');
      } catch (err) {
        showToast('error', '楽曲情報の更新に失敗しました');
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      showToast('info', '更新する楽曲が存在しないため、処理を中断しました');
    }
  };

  const handleOnClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isLoading) {
      e.preventDefault();
    }
  };

  const onChangeEditMusic = (event: React.ChangeEvent<HTMLInputElement>, musicId: number, musicDifficulty: string) => {
    const newNoteCount: number = parseInt(event.target.value, 10);
    setMusicList((prevMusicList) =>
      prevMusicList.map((music) => ({
        ...music,
        metaMusic: music.metaMusic.map((meta) => {
          if (music.id === musicId && meta.musicDifficulty === musicDifficulty) {
            const updatedMeta = { ...meta, totalNoteCount: newNoteCount };
            setChangedMetaMusic((prevChanged) => [...prevChanged.filter((m) => m.id !== meta.id), updatedMeta]);
            return updatedMeta;
          }
          return meta;
        }),
      })),
    );
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: SelectChangeEvent<number>) => {
    const genreId = event.target.value as number;
    setCurrentGenre(genreId);
  };

  return (
    <>
      <div className='flex flex-col min-h-screen'>
        <Header />
        <div className='flex-grow container mx-auto px-4 py-8'>
          <div className='flex space-x-4 mb-6'>
            <NavLink to={'/'} onClick={handleOnClick}>
              <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                トップページへ
              </Typography>
            </NavLink>
            <NavLink to={'/admin'} onClick={handleOnClick}>
              <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                管理者トップページへ
              </Typography>
            </NavLink>
            <Button variant='contained' onClick={updateMusic} disabled={isLoading}>
              楽曲の更新を行う
            </Button>
            <Button variant='contained' onClick={editMusicInfo} disabled={isLoading}>
              楽曲の編集を行う
            </Button>

            <FormControl variant='outlined' className='px-3'>
              <InputLabel id='genre-select-label'>Genre</InputLabel>
              <Select
                labelId='genre-select-label'
                value={genres.find((genre) => genre.id == currentGenre)?.id || 1}
                onChange={handleChange}
                label='Genre'
                disabled={isLoading}
              >
                {genres.map((genre) => (
                  <MenuItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                    {musicList[0] &&
                      musicList[0].metaMusic.map((meta) => (
                        <TableCell key={meta.id}>譜面情報({meta.musicDifficulty})</TableCell>
                      ))}
                    <TableCell>ユニット情報</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {musicList.map((music, idx) => (
                    <TableRow key={idx + 1}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{music.name}</TableCell>
                      {music.metaMusic.map((meta) => (
                        <TableCell key={meta.id} className='d-flex justify-between'>
                          <span>
                            {meta.musicDifficulty}({meta.playLevel}) :
                          </span>
                          <hr className='py-1' />
                          <div>
                            <input
                              className='w-full h-8'
                              type='number'
                              value={meta.totalNoteCount}
                              min={0}
                              max={9999}
                              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                onChangeEditMusic(event, idx, meta.musicDifficulty)
                              }
                            />
                          </div>
                        </TableCell>
                      ))}
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
