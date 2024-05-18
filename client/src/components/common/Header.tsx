import { CodeResponse, useGoogleLogin } from '@react-oauth/google';
import axiosClient from '../../utils/axios';
import { Google } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useUserStore } from '../store/userStore';
import { useEffect } from 'react';

const Header = () => {
  const { user, isLoggedIn } = useUserStore();

  useEffect(() => {
    checkLoginStatus();
  }, []);
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => handleGoogleLoginSuccess(codeResponse),
    flow: 'auth-code',
    scope: 'email profile openid',
    onError: (error) => handleGoogleLoginFailure(error),
  });

  const handleGoogleLoginSuccess = async (
    response: Omit<CodeResponse, 'error' | 'error_description' | 'error_uri'>,
  ) => {
    try {
      const data = await axiosClient.post(`${import.meta.env.VITE_APP_URL}auth/google/login`, {
        code: response.code,
      });
      useUserStore.getState().setAccessToken(data.data.accessToken);
      useUserStore.getState().setUser(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoogleLoginFailure = (error: Pick<CodeResponse, 'error' | 'error_description' | 'error_uri'>) => {
    console.error('Google login error:', error);
  };

  const handleLogout = () => {
    useUserStore.getState().logout();
  };

  async function checkLoginStatus() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.log('No access token found');
      return false;
    }

    const user = useUserStore.getState().user;

    try {
      const isValid = await axiosClient.get(`${import.meta.env.VITE_APP_URL}auth/verify`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          userId: user?.id || null,
        },
      });
      useUserStore.getState().setIsLoggedIn(isValid.data);

      return true;
    } catch (error) {
      console.log('Token validation failed:', error);
      return false;
    }
  }

  return (
    <div className=' text-white p-4 flex justify-between items-center'>
      {/* TODO:ここはいらないので後々削除予定 */}
      <Typography variant='h5' component='div'></Typography>

      {/* ログイン状態に応じた表示 */}
      {isLoggedIn ? (
        <div className='flex mx-4'>
          <img className='h-10 w-10 rounded-full mx-5' src={user?.imageUrl} alt='Profile' />
          <Button variant='contained' onClick={handleLogout}>
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
