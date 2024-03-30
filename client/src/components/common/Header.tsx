import { Button } from '@material-ui/core';
import { Search } from '@trejgun/material-ui-icons-google';
const Header = () => {
  return (
    <>
      <div className='bg-blue-500'>
        <div className='py-4 px-6 font-medium'>
          <p className='text-white text-xl'>音ゲースコア管理アプリ</p>
        </div>
        <div className=''>
          <Button>
            <Search className='bg-white h-8 w-8' />
          </Button>
        </div>
      </div>
    </>
  );
};

export default Header;
