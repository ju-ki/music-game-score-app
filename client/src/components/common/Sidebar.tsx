import { Divider, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import SettingsIcon from '@mui/icons-material/Settings';

const Sidebar = () => {
  const { user, isLoggedIn } = useUserStore();
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
