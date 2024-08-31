import {
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import SettingsIcon from '@mui/icons-material/Settings';
import useFetchGenres from '../hooks/useFetchGenres';
import { useGenre } from '../store/useGenre';
import { useDifficulty } from '../store/useDifficulty';
import useSetDifficulties from '../hooks/useSetDifficulties';
import { useEffect } from 'react';

const Sidebar = () => {
  useFetchGenres();
  useSetDifficulties();
  const { user, isLoggedIn } = useUserStore();
  const { genres, currentGenre, setCurrentGenre } = useGenre();
  const { difficulties, currentDifficulty, setCurrentDifficulty, loadCurrentDifficulty } = useDifficulty();
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    loadCurrentDifficulty(currentGenre);
  }, [currentGenre]);

  const handleChange = (event: SelectChangeEvent<number>) => {
    setCurrentGenre(event.target.value as number);
  };

  const handleChangeDifficulty = (event: SelectChangeEvent<number>) => {
    const targetDifficulty = difficulties.find((difficulty) => difficulty.id === event.target.value);
    if (targetDifficulty) {
      setCurrentDifficulty(targetDifficulty);
    }
  };
  return (
    <div className='w-64 h-full shadow-md bg-white fixed flex flex-col'>
      <div className='p-4 bg-blue-500 text-white'>
        <NavLink to={'/'}>
          <Typography variant='h6' component='div' color={'white'}>
            音ゲースコア管理アプリ
          </Typography>
        </NavLink>
      </div>
      {isLoggedIn && (
        <>
          <div className='flex-grow'>
            <List>
              <NavLink
                to='/music'
                style={{ display: 'block' }}
                className={({ isActive }) => (isActive ? 'bg-gray-400 text-blue-500' : '')}
              >
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText primary='楽曲一覧' />
                  </ListItemButton>
                </ListItem>
              </NavLink>
              <Divider />
              <NavLink
                to='/scores'
                style={{ display: 'block' }}
                className={({ isActive }) => (isActive ? 'bg-gray-400 text-blue-500' : '')}
              >
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText primary='スコア一覧' />
                  </ListItemButton>
                </ListItem>
              </NavLink>
              <Divider />
              <NavLink
                to='/register-music-score'
                style={{ display: 'block' }}
                className={({ isActive }) => (isActive ? 'bg-gray-400 text-blue-500' : '')}
              >
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText primary='スコア登録' />
                  </ListItemButton>
                </ListItem>
              </NavLink>
              <Divider />
              <NavLink
                to='/my-list'
                style={{ display: 'block' }}
                className={({ isActive }) => (isActive ? 'bg-gray-400 text-blue-500' : '')}
              >
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText primary='マイリスト' />
                  </ListItemButton>
                </ListItem>
              </NavLink>
            </List>
          </div>
          <FormControl variant='outlined' className=''>
            <InputLabel id='difficulty-select-label'>難易度</InputLabel>
            <Select
              labelId='difficulty-select-label'
              value={
                currentDifficulty
                  ? difficulties.find((difficulty) => difficulty.difficulty === currentDifficulty.difficulty)?.id || ''
                  : ''
              }
              onChange={handleChangeDifficulty}
              label='難易度'
              disabled={!!(location.pathname.split('/')[1] === 'my-list' && params.myListId)}
            >
              {difficulties.map((difficulty) => (
                <MenuItem key={difficulty.id} value={difficulty.id}>
                  {difficulty.difficulty}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br className='my-4' />
          <FormControl variant='outlined' className=''>
            <InputLabel id='genre-select-label'>Genre</InputLabel>
            <Select
              labelId='genre-select-label'
              value={genres.find((genre) => genre.id == currentGenre)?.id || ''}
              onChange={handleChange}
              label='Genre'
              disabled={!!(location.pathname.split('/')[1] === 'my-list' && params.myListId)}
            >
              {genres.map((genre) => (
                <MenuItem key={genre.id} value={genre.id}>
                  {genre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {user?.authority === 'ADMIN' && (
            <div className='p-4'>
              <NavLink to='/admin'>
                <SettingsIcon sx={{ fontSize: 40 }} />
              </NavLink>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Sidebar;
