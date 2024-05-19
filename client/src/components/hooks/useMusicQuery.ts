import { useInfiniteQuery } from '@tanstack/react-query';
import axiosClient from '../../utils/axios';

/**
 *
 * @param page ページ
 * @param isInfinityScroll 無限スクロールの実装するか(falseの場合は全権取得)
 * @returns 楽曲リスト
 */
export const fetchMusicList = async (page: number, isInfinityScroll: boolean) => {
  const response = await axiosClient.get(`${import.meta.env.VITE_APP_URL}songs/search`, {
    params: {
      musicTag: 0,
      genreId: 1,
      page: page,
      isInfinityScroll: isInfinityScroll,
    },
  });

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
