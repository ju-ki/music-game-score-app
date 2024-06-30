import { useInfiniteQuery } from '@tanstack/react-query';
import axiosClient from '../../utils/axios';
import { useGenre } from '../store/useGenre';

/**
 *
 * @param page ページ
 * @param isInfinityScroll 無限スクロールの実装するか(falseの場合は全権取得)
 * @returns 楽曲リスト
 */
export const fetchMusicList = async (page: number, isInfinityScroll: boolean, currentGenre: number) => {
  const response = await axiosClient.get(`${import.meta.env.VITE_APP_URL}/songs/search`, {
    params: {
      musicTag: 0,
      genreId: currentGenre || 1,
      page: page,
      isInfinityScroll: isInfinityScroll,
    },
  });

  return response.data;
};

export const useMusicQuery = () => {
  const { currentGenre } = useGenre();
  return useInfiniteQuery({
    queryKey: ['musicList', currentGenre],
    queryFn: ({ pageParam = 1 }) => fetchMusicList(pageParam, true, currentGenre),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ? lastPage.nextPage : undefined;
    },
  });
};
