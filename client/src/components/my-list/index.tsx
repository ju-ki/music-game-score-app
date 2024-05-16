import Sidebar from '../common/Sidebar';
import Header from '../common/Header';
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  Modal,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { fetchMusicList } from '../hooks/useMusicQuery';
import { Fragment, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosClient from '../../utils/axios';
import { useUserStore } from '../store/userStore';
import { Link } from 'react-router-dom';
import { MusicType, MyListType, SelectedMusicType } from '../../types/score';
import { Close } from '@mui/icons-material';

const MyList = () => {
  const schema = z.object({
    myListName: z.string().min(1, { message: 'マイリスト名は必須です' }),
    selectedMusic: z
      .array(
        z.object({
          id: z.number(),
        }),
      )
      .nonempty({ message: '一つ以上の曲を選択してください' }),
  });
  type FormData = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      myListName: '',
      selectedMusic: [],
    },
    resolver: zodResolver(schema),
  });

  const { append, remove } = useFieldArray({
    control,
    name: 'selectedMusic',
  });
  const { user } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [musicList, setMusicList] = useState<MyListType[]>([]);
  const [allMusicList, setAllMusicList] = useState<MusicType[]>([]);
  const [filteredMusicList, setFilteredMusicList] = useState<MusicType[]>([]);

  const getAllMusic = async () => {
    try {
      const response = await fetchMusicList(0, false);

      setAllMusicList(response.items);
    } catch (err) {
      console.log(err);
    }
  };

  const selectedMusicList: SelectedMusicType[] = watch('selectedMusic');
  useEffect(() => {
    getAllMusic();
    getMusicList();
  }, []);

  const getMusicList = async () => {
    try {
      const response = await axiosClient.get(`${import.meta.env.VITE_APP_URL}music-list`, {
        params: {
          userId: user?.id,
          genreId: 1,
        },
      });

      setMusicList(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      setFilteredMusicList(
        allMusicList.filter((musicData: MusicType) => {
          const matchName = musicData.name.toLowerCase().includes(searchQuery);
          return matchName;
        }),
      );
    } else {
      setFilteredMusicList(allMusicList);
    }
  }, [searchQuery, allMusicList]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const onSubmit = async (data: FormData) => {
    const musicIdList = data.selectedMusic.map((item) => item.id);
    try {
      const response = await axiosClient.post(`${import.meta.env.VITE_APP_URL}music-list`, {
        myListName: data.myListName,
        selectedMusic: musicIdList,
        genreId: 1,
        userId: user?.id,
      });
      setMusicList((prev) => [...prev, response.data]);
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
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
                width: '50%',
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
                {selectedMusicList.length > 0 && (
                  <div>
                    <Typography variant='h6' gutterBottom>
                      選択中の曲
                    </Typography>
                    {errors.selectedMusic && (
                      <span className='text-red-500 mb-2 block'>{errors.selectedMusic.message}</span>
                    )}
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                      {selectedMusicList.map((selectedMusic) => (
                        <Box
                          key={selectedMusic.id}
                          sx={{
                            border: '1px solid #ccc',
                            p: 1,
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography noWrap gutterBottom variant='body2'>
                            {allMusicList?.find((music) => music.id === selectedMusic.id)?.name}
                          </Typography>
                          <IconButton
                            color='error'
                            size='small'
                            onClick={() => {
                              const musicId = selectedMusic.id;
                              const index = selectedMusicList.findIndex((field) => field.id === musicId);
                              if (index !== -1) {
                                remove(index);
                              }
                            }}
                          >
                            <Close />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </div>
                )}
                <Divider className='py-2' />
                <Box component='div' sx={{ maxHeight: '40vh', overflow: 'auto' }}>
                  <FormGroup>
                    {filteredMusicList?.length ? (
                      filteredMusicList.map((music: MusicType) => (
                        <Fragment key={music.id}>
                          <FormControlLabel
                            key={music.id}
                            className='justify-between px-5'
                            control={
                              <Switch
                                checked={selectedMusicList.some((field) => field.id === music.id)}
                                onChange={(e) => {
                                  const musicId = music.id;
                                  if (e.target.checked) {
                                    append({ id: musicId });
                                  } else {
                                    const index = selectedMusicList.findIndex((field) => field.id === musicId);
                                    if (index !== -1) {
                                      remove(index);
                                    }
                                  }
                                }}
                              />
                            }
                            label={music.name}
                            value={music.id}
                            labelPlacement='start'
                          />
                          <Divider />
                        </Fragment>
                      ))
                    ) : (
                      <Typography gutterBottom align='center' className='py-5'>
                        検索ワードに一致する曲がありません
                      </Typography>
                    )}
                  </FormGroup>
                </Box>
                <Button variant='contained' color='primary' type='submit' fullWidth>
                  作成する
                </Button>
              </form>
            </Box>
          </Modal>

          <div className='bg-gray-100 p-4 rounded-lg'>
            <h2 className='text-xl font-semibold mb-4'>マイリスト一覧</h2>
            {musicList.length ? (
              <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {musicList.map((music: MyListType) => (
                  <Link key={music.id} to={`/my-list/${music.id}`}>
                    <li className='bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer'>
                      <h3 className='text-lg font-semibold mb-2'>{music.name}</h3>
                      <p className='text-gray-500'>{music.musics.length || 0} 曲</p>
                    </li>
                  </Link>
                ))}
              </ul>
            ) : (
              <p className='text-gray-500'>マイリストがありません。</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyList;
