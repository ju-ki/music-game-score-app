import Sidebar from '../common/Sidebar';
import Header from '../common/Header';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { fetchMusicList, useMusicQuery } from '../hooks/useMusicQuery';
import { useEffect, useState } from 'react';

const MyList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState([]);
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

  const handleScroll = (e) => {
    const scrollHeight = e.currentTarget.scrollHeight;
    const scrollTop = e.currentTarget.scrollTop;
    const clientHeight = e.currentTarget.clientHeight;
    const bottom = scrollHeight - scrollTop + 0.5 === clientHeight;

    if (bottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
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
              <Typography variant='h6' component='h2' mb={2}>
                マイリストを作成する
              </Typography>
              <TextField label='マイリスト名' variant='outlined' fullWidth margin='normal' />
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
              <Box sx={{ maxHeight: '40vh', overflow: 'auto' }} onScroll={handleScroll}>
                {filteredMusicList?.length &&
                  filteredMusicList.map((music) => (
                    <div key={music.id}>
                      <label>
                        <input
                          type='checkbox'
                          value={music.id}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSongs([...selectedSongs, music.id]);
                            } else {
                              setSelectedSongs(selectedSongs.filter((id) => id !== music.id));
                            }
                          }}
                        />
                        {music.name}
                      </label>
                    </div>
                  ))}
              </Box>
              <Button variant='contained' color='primary' fullWidth>
                作成する
              </Button>
            </Box>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default MyList;
