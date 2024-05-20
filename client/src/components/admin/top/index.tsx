import { Button, Typography } from '@mui/material';
import Header from '../../common/Header';
import { NavLink } from 'react-router-dom';

const AdminTop = () => {
  return (
    <>
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-8">
      <NavLink to={'/'} >
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          トップページへ
        </Typography>
      </NavLink>
        <Typography className="mb-6" variant="h4" component="div">
          管理画面
        </Typography>
        <div className="flex space-x-4">
          <NavLink to={'/admin/users'}>
            <Button variant="contained">ユーザー一覧</Button>
          </NavLink>
          <NavLink to={'/admin/musics'}>
            <Button variant="contained">楽曲一覧</Button>
          </NavLink>
        </div>
      </div>
    </div>
  </>
  );
};

export default AdminTop;
