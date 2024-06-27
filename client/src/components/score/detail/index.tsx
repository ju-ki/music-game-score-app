import Sidebar from '../../common/Sidebar';
import Header from '../../common/Header';
import ScoreListView from '../feature/ScoreListView';
const MusicScoreList = () => {
  return (
    <div className='flex h-screen'>
      <div className='flex-initial w-1/5'>
        <Sidebar />
      </div>

      <div className='flex-auto w-4/5'>
        <Header />
        <main className='p-4'>
          <ScoreListView />
        </main>
      </div>
    </div>
  );
};

export default MusicScoreList;
