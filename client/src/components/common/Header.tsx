import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import axiosClient from '../../utils/axios';
// import { useAuthStore } from '../hooks/useAuth';
// import { useEffect } from 'react';
// import axiosClient from '../../utils/axios';
// import axiosClient from '../../utils/axios';
const Header = () => {
  // const { authData } = useAuthStore();

  // const setAuthData = useAuthStore((state: any) => state.setAuthData);
  // useEffect(() => {
  //   async function test() {
  //     try {
  //       const response = await axiosClient.get('google/is_login', {
  //         withCredentials: true,
  //       });
  //       console.log(response);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }

  //   test();
  // }, []);

  // const onClickGoogleButton = async () => {
  //   try {
  //     window.location.href = `${import.meta.env.VITE_APP_URL}auth/google`;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
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
      console.log(user);
    } catch (err) {
      console.log(err);
    }
    // try {
    //   const response = await axiosClient.post(`${import.meta.env.VITE_APP_URL}auth/google/login`, {
    //     token: credentialResponse.credential,
    //   });
    //   const data = response.data;
    //   localStorage.setItem('authData', JSON.stringify(data));
    //   setAuthData(data);
    // } catch (err) {
    //   console.log(err);
    // }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google login error:', error);
  };

  // // 成功時の処理
  // const handleSuccess = async (response) => {
  //   try {
  //     console.log(response);

  //     // バックエンドに認証コードを送信
  //     const backendResponse = await axiosClient.post(`${import.meta.env.VITE_APP_URL}auth/google/login`, {
  //       code: response.credential,
  //     });
  //     console.log('Backend response:', backendResponse.data);
  //     // 必要に応じてさらに処理
  //   } catch (err) {
  //     console.error('Error posting to backend:', err);
  //   }
  // };

  // // エラー時の処理
  // const handleError = (error) => {
  //   console.error('Login failed:', error);
  // };
  return (
    <>
      <div className='bg-blue-500'>
        <div className='flex justify-between items-center'>
          <div className='py-4 px-6 font-medium'>
            <p className='text-white text-xl'>音ゲースコア管理アプリ</p>
          </div>
          {/* <div className='mx-10'>
            <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={handleGoogleLoginFailure} />
          </div> */}
          <button onClick={login}>Signin in with Google</button>
          {/* <GoogleLogin onSuccess={handleSuccess} onError={handleError} /> */}
        </div>
      </div>
    </>
  );
};

export default Header;
