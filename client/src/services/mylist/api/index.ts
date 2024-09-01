import { FormData } from '../../../components/modal';
import { MyListType } from '../../../types/score';
import axiosClient from '../../../utils/axios';

export const getMyListDetail = async (params: {
  userId: string | undefined;
  genreId: number;
  myListId: string;
}): Promise<MyListType | void> => {
  try {
    const response = await axiosClient.get(`${import.meta.env.VITE_APP_URL}/music-list/getMyList`, {
      params: {
        myListId: params.myListId,
        userId: params.userId,
        genreId: params.genreId,
      },
    });

    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const addMusicToMyList = async (
  params: { myListId: string; userId: string | undefined; genreId: number },
  data: FormData,
) => {
  try {
    const musicIdList = data.selectedMusic.map((item) => item.id);
    const response = await axiosClient.post(`${import.meta.env.VITE_APP_URL}/music-list/add`, {
      musicListId: params.myListId,
      selectedMusic: musicIdList,
      userId: params.userId,
      musicGenreId: params.genreId,
    });

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const deleteMyListMusic = async (params: { userId: string | undefined; genreId: number; myListId: string }) => {
  try {
    await axiosClient.delete(`${import.meta.env.VITE_APP_URL}/music-list`, {
      params: {
        musicListId: params.myListId,
        userId: params.userId,
        genreId: params.genreId,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
