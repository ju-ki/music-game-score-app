import { Divider, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className='w-64 h-full shadow-md bg-white absolute'>
      <div className='p-4 bg-blue-500 text-white'>
        <Typography variant='h6' component='div'>
          音ゲースコア管理アプリ
        </Typography>
      </div>
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
  );
};

export default Sidebar;
