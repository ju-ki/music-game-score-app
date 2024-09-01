import { useEffect, useState } from 'react';
import Header from '../../common/Header';
import Sidebar from '../../common/Sidebar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MyListType, RelationMyListType } from '../../../types/score';
import MusicMyListModal from '../../modal';
import { Button } from '@mui/material';
import { useAddMusic, useDeleteMyList, useFetchMyList } from '../../hooks/useMyList';
import { showToast } from '../../common/Toast';
import { Id, toast } from 'react-toastify';

const MyListDetail = () => {
  const { myListId } = useParams();
  const [musicDetail, setMusicDetail] = useState<MyListType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastId, setToastId] = useState<Id | undefined>();
  const navigate = useNavigate();
  const { myListDetail, isLoading } = useFetchMyList();
  const { addMusic, updatedMyListDetail } = useAddMusic(setIsModalOpen);
  const { deleteMyList } = useDeleteMyList();

  useEffect(() => {
    if (isLoading) {
      setToastId(showToast('info', 'スコア情報取得中', { autoClose: false }));
      return;
    } else {
      toast.dismiss(toastId);
    }
  }, [isLoading]);

  useEffect(() => {
    if (myListDetail) {
      setMusicDetail(myListDetail);
    }
    if (updatedMyListDetail) {
      setMusicDetail(updatedMyListDetail);
    }
  }, [myListDetail, updatedMyListDetail]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!myListId) {
    showToast('error', '無効な操作がされました');
    navigate('/my-list');
    return;
  }

  if (!musicDetail) {
    return;
  }

  return (
    <div className='flex h-screen'>
      <div className='flex-initial w-1/5'>
        <Sidebar />
      </div>
      <div className='flex-auto w-4/5'>
        <Header />
        <main className='p-4'>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <MusicMyListModal
              isModalOpen={isModalOpen}
              handleCloseModal={handleCloseModal}
              onSubmit={addMusic}
              defaultMusicList={musicDetail?.musics.map((obj) => obj.musicId)}
              myListName={musicDetail?.name}
            />
            <div className='flex items-center justify-between my-3 '>
              <h1 className='text-2xl font-semibold mb-4'>{myListDetail?.name}</h1>
              <div className='space-x-3'>
                <Button onClick={handleOpenModal} variant='contained'>
                  マイリスト編集
                </Button>
                <Button onClick={() => deleteMyList()} variant='contained' color='error'>
                  マイリスト削除
                </Button>
              </div>
            </div>
            <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {musicDetail?.musics.map((music: RelationMyListType) => (
                <Link
                  key={music.musicId}
                  to={`/register-music-score/${music.musicId}`}
                  className='bg-gray-100 rounded-lg p-4 shadow hover:shadow-md transition-shadow duration-300'
                >
                  {music.music.name}
                </Link>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyListDetail;
