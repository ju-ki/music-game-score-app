import { useGoogleLogin } from '@react-oauth/google';
import axiosClient from '../../utils/axios';
import { Google } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useUserStore } from '../store/userStore';

const Header = () => {
  const { user, isLoggedIn } = useUserStore();
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

      useUserStore.getState().setUser(user.data);
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
                <img className='h-10 w-10 rounded-full mx-10' src={user?.imageUrl} alt='Profile' />
                <button onClick={() => handleLogout()}>ログアウト</button>
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
