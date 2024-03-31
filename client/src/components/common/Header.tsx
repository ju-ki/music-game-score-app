import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';
import { useEffect } from 'react';
import axiosClient from '../../utils/axios';
// import axiosClient from '../../utils/axios';
const Header = () => {
  useEffect(() => {
    async function test() {
      try {
        const response = await axiosClient.get('google/is_login');
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    }

    test();
  }, []);

  const onClickGoogleButton = async () => {
    try {
      window.location.href = `${import.meta.env.VITE_APP_URL}google`;
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className='bg-blue-500'>
        <div className='flex justify-between items-center'>
          <div className='py-4 px-6 font-medium'>
            <p className='text-white text-xl'>音ゲースコア管理アプリ</p>
          </div>
          <div className='mx-10'>
            <Button variant='contained' startIcon={<GoogleIcon />} onClick={() => onClickGoogleButton()}>
              <p>Googleでログイン</p>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
