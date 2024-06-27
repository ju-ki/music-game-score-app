// import { CodeResponse, useGoogleLogin } from '@react-oauth/google';
// import axiosClient from '../../utils/axios';
import { Google } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useUserStore } from '../store/userStore';
import { useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const Header = () => {
  const { user, isLoggedIn, logout, checkLoginStatus, handleGoogleLoginSuccess, handleGoogleLoginFailure } =
    useUserStore();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => handleGoogleLoginSuccess(codeResponse),
    flow: 'auth-code',
    scope: 'email profile openid',
    onError: (error) => handleGoogleLoginFailure(error),
  });

  return (
    <div className=' text-white p-4 flex justify-between items-center'>
      {/* TODO:ここはいらないので後々削除予定 */}
      <Typography variant='h5' component='div'></Typography>

      {/* ログイン状態に応じた表示 */}
      {isLoggedIn ? (
        <div className='flex mx-4'>
          <img className='h-10 w-10 rounded-full mx-5' src={user?.imageUrl} alt='Profile' />
          <Button variant='contained' onClick={logout}>
            ログアウト
          </Button>
        </div>
      ) : (
        <Button variant='contained' color='inherit' startIcon={<Google />} onClick={login}>
          Googleでログイン
        </Button>
      )}
    </div>
  );
};

export default Header;
