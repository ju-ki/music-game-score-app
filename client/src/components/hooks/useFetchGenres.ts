import { useEffect } from 'react';
import { useGenre } from '../store/useGenre';
import axiosClient from '../../utils/axios';

const useFetchGenres = () => {
  const { setGenres } = useGenre();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axiosClient.get(`${import.meta.env.VITE_APP_URL}meta-music/genre`);
        setGenres(response.data);
      } catch (err) {
        console.log('Error fetching genres:', err);
      }
    };

    fetchGenres();
  }, [setGenres]);
};

export default useFetchGenres;
