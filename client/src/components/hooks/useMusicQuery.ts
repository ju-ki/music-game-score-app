import { useInfiniteQuery } from '@tanstack/react-query';
import axiosClient from '../../utils/axios';

export const fetchMusicList = async (page: number, isInfinityScroll: boolean) => {
  console.log(isInfinityScroll);

  const response = await axiosClient.get(`${import.meta.env.VITE_APP_URL}songs/search`, {
    params: {
      musicTag: 0,
      genreId: 1,
      page: page,
      isInfinityScroll: isInfinityScroll,
    },
  });
  console.log(response.data);

  return response.data;
};

export const useMusicQuery = () => {
  return useInfiniteQuery({
    queryKey: ['musicList'],
    queryFn: ({ pageParam = 1 }) => fetchMusicList(pageParam, true),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ? lastPage.nextPage : undefined;
    },
  });
};
