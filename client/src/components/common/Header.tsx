import { useGoogleLogin } from '@react-oauth/google';
import axiosClient from '../../utils/axios';
import { Google } from '@mui/icons-material';
import { Button } from '@mui/material';
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

  const handleGoogleLoginSuccess = async (response) => {
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

  const handleGoogleLoginFailure = (error) => {
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
    <>
      <div className='bg-blue-500'>
        <div className='flex justify-between items-center'>
          <div className='py-4 px-6 font-medium'>
            <p className='text-white text-xl'>音ゲースコア管理アプリ</p>
          </div>
          {isLoggedIn ? (
            <>
              <div className='flex mx-4'>
                <img className='h-10 w-10 rounded-full mx-5' src={user?.imageUrl} alt='Profile' />
                <Button variant='contained' onClick={() => handleLogout()}>
                  ログアウト
                </Button>
              </div>
            </>
          ) : (
            <Button variant='contained' color='inherit' startIcon={<Google />} onClick={login}>
              Googleでログイン
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
