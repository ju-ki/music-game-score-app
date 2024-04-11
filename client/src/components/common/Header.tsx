import { useGoogleLogin } from '@react-oauth/google';
import axiosClient from '../../utils/axios';
import { Google } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useState } from 'react';
// import { useAuthStore } from '../hooks/useAuth';
// import { useEffect } from 'react';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    imageUrl: string;
  }>();
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => handleGoogleLoginSuccess(codeResponse),
    flow: 'auth-code',
    scope: 'email profile openid',
    onError: (error) => handleGoogleLoginFailure(error),
  });

  const handleGoogleLoginSuccess = async (response) => {
    try {
      console.log(response);
      const user = await axiosClient.post(`${import.meta.env.VITE_APP_URL}auth/google/login`, {
        code: response.code,
      });
      setIsLoggedIn(true);
      setUser(user.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google login error:', error);
  };
  return (
    <>
      <div className='bg-blue-500'>
        <div className='flex justify-between items-center'>
          <div className='py-4 px-6 font-medium'>
            <p className='text-white text-xl'>音ゲースコア管理アプリ</p>
          </div>
          {isLoggedIn ? (
            <>
              <div>
                <p>Welcome, {user?.name}!</p>
                <img src={user?.imageUrl} alt='Profile' />
                <button>Logout</button>
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
