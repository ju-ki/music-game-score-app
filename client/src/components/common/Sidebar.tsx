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

const Sidebar = () => {
  useFetchGenres();
  const { user, isLoggedIn } = useUserStore();
  const { genres, currentGenre, setCurrentGenre } = useGenre();
  const location = useLocation();
  const params = useParams();

  const handleChange = (event: SelectChangeEvent<number>) => {
    setCurrentGenre(event.target.value as number);
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
          <FormControl variant='outlined' className='px-3'>
            <InputLabel id='genre-select-label'>Genre</InputLabel>
            <Select
              labelId='genre-select-label'
              value={genres.find((genre) => genre.id == currentGenre)?.id || 1}
              onChange={handleChange}
              label='Genre'
              disabled={location.pathname.split('/')[1] === 'my-list' && params.myListId ? true : false}
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
