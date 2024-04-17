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
      <List component='nav'>
        <ListItem
          disablePadding
          component={NavLink}
          to='/music'
          className={({ isActive }) => (isActive ? 'bg-gray-400 text-blue-500' : '')}
        >
          <ListItemButton>
            <ListItemText primary='楽曲一覧' />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem
          disablePadding
          component={NavLink}
          to='/scores'
          end
          className={({ isActive }) => (isActive ? 'bg-gray-400 text-blue-500' : '')}
        >
          <ListItemButton>
            <ListItemText primary='スコア一覧' />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem
          disablePadding
          component={NavLink}
          to='/my-list'
          end
          className={({ isActive }) => (isActive ? 'bg-gray-400 text-blue-500' : '')}
        >
          <ListItemButton>
            <ListItemText primary='マイリスト' />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
