import { Close } from '@mui/icons-material';
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
import { Fragment, useEffect, useState } from 'react';
import { MusicType, SelectedMusicType } from '../../types/score';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { fetchMusicList } from '../hooks/useMusicQuery';

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

type ModalType = {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  onSubmit: (data: FormData) => void;
  defaultMusicList: number[];
  myListName: string;
};

const MusicMyListModal = (props: ModalType) => {
  const { isModalOpen, handleCloseModal, onSubmit, defaultMusicList, myListName } = props;

  const [searchQuery, setSearchQuery] = useState('');
  const [allMusicList, setAllMusicList] = useState<MusicType[]>([]);
  const [filteredMusicList, setFilteredMusicList] = useState<MusicType[]>([]);
  const transformedDefaultMusicList = defaultMusicList.map((id) => ({ id }));

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      myListName: myListName,
      selectedMusic: transformedDefaultMusicList.length ? transformedDefaultMusicList : [],
    },
    resolver: zodResolver(schema),
  });

  const { append, remove } = useFieldArray({
    control,
    name: 'selectedMusic',
  });
  const selectedMusicList: SelectedMusicType[] = watch('selectedMusic');
  const getAllMusic = async () => {
    try {
      const response = await fetchMusicList(0, false);

      setAllMusicList(response.items);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllMusic();
  }, []);

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

  return (
    <>
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
              disabled={defaultMusicList.length ? true : false}
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
    </>
  );
};

export default MusicMyListModal;
