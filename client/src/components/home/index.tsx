import Header from '../common/Header';
import Sidebar from '../common/Sidebar';

const Home = () => {
  return (
    <div className='flex h-screen'>
      <div className='flex-initial w-1/5'>
        <Sidebar />
      </div>

      <div className='flex-auto w-4/5'>
        <Header />
        <main className='p-4'>
          <h1>ようこそスコア管理アプリへ</h1>
        </main>
      </div>
    </div>
  );
};

export default Home;
