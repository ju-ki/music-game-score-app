import Sidebar from '../common/Sidebar';
import Header from '../common/Header';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { useMusicQuery } from '../hooks/useMusicQuery';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const MyList = () => {
  const schema = z.object({
    myListName: z.string().min(1, { message: 'マイリスト名は必須です' }),
    selectedMusic: z.number().array().nonempty({ message: '一つ以上曲を選択してください' }),
  });
  type FormData = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      myListName: '',
      selectedMusic: [],
    },
    resolver: zodResolver(schema),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useMusicQuery();

  const getFilteredMusicIds = () => {
    return data?.pages
      .flatMap((page) => page.items)
      .flatMap(
        (musicData) => musicData.musicTag.map((tag) => tag.musicId), // Convert matching tags to an array of musicIds
      );
  };

  const filteredMusicList = data?.pages
    .flatMap((page) => page.items)
    .filter((musicData) => {
      const matchName = musicData.name.toLowerCase().includes(searchQuery);
      const filteredMusicIds = getFilteredMusicIds();
      const isMusicIdMatched = !filteredMusicIds?.length || filteredMusicIds.includes(musicData.id);
      return matchName && isMusicIdMatched;
    });
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleScroll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const scrollHeight = e.currentTarget.scrollHeight;
    const scrollTop = e.currentTarget.scrollTop;
    const clientHeight = e.currentTarget.clientHeight;
    const bottom = scrollHeight - scrollTop + 0.5 === clientHeight;

    if (bottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const onSubmit = (data: FormData) => {
    console.log(data);
  };
  return (
    <div className='flex h-screen'>
      <div className='flex-initial w-1/5'>
        <Sidebar />
      </div>

      <div className='flex-auto w-4/5'>
        <Header />
        <main className='p-4'>
          <h1>マイリスト</h1>
          <Button onClick={handleOpenModal}>マイリスト作成</Button>
          <Modal open={isModalOpen} onClose={handleCloseModal}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                maxHeight: '90vh', // 最大高さを設定
                overflow: 'auto', // スクロールを有効にする
              }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className='p-4 bg-white shadow-md rounded-md'>
                <Typography variant='h6' component='h2' mb={2}>
                  マイリストを作成する
                </Typography>
                <TextField
                  label='マイリスト名'
                  variant='outlined'
                  fullWidth
                  margin='normal'
                  {...register('myListName')}
                />
                {errors.myListName && <span className='text-red-500 mb-2 block'>{errors.myListName.message}</span>}
                <TextField
                  label='楽曲を検索'
                  variant='outlined'
                  fullWidth
                  margin='normal'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Typography variant='body1' mb={1}>
                  曲を選択してください
                </Typography>
                {/* 選択中の曲を表示する */}
                {getValues('selectedMusic').length > 0 && (
                  <div>
                    <Typography variant='h6' gutterBottom>
                      選択中の曲
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                      {getValues('selectedMusic').map((musicId) => (
                        <Typography key={musicId} sx={{ border: '1px solid #ccc', p: 1, borderRadius: 1 }}>
                          {filteredMusicList?.find((music) => music.id == musicId)?.name}
                        </Typography>
                      ))}
                    </Box>
                  </div>
                )}
                {errors.selectedMusic && (
                  <span className='text-red-500 mb-2 block'>{errors.selectedMusic.message}</span>
                )}
                <Box sx={{ maxHeight: '40vh', overflow: 'auto' }} onScroll={handleScroll}>
                  {filteredMusicList?.length &&
                    filteredMusicList.map((music) => (
                      <div key={music.id}>
                        <label>
                          <input type='checkbox' value={music.id} {...register('selectedMusic')} />
                          {music.name}
                        </label>
                      </div>
                    ))}
                </Box>
                <Button variant='contained' color='primary' type='submit' fullWidth>
                  作成する
                </Button>
              </form>
            </Box>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default MyList;
