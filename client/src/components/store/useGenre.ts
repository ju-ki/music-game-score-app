import { create } from 'zustand';

type Genre = {
  id: number;
  name: string;
};

type GenreStore = {
  genres: Genre[] | [];
  currentGenre: number;
  setGenres: (genres: Genre[]) => void;
  setCurrentGenre: (genre: number) => void;
};

const saveGenreToLocalStorage = (genreId: number | null) => {
  try {
    if (genreId) {
      localStorage.setItem('genre', JSON.stringify(genreId));
    }
  } catch (err) {
    console.error(err);
  }
};

const loadGenreFromLocalStorage = () => {
  try {
    const genre = localStorage.getItem('genre');
    return genre ? JSON.parse(genre) : null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const useGenre = create<GenreStore>((set) => ({
  genres: [],
  currentGenre: loadGenreFromLocalStorage(),
  setGenres: (genres: Genre[]) => {
    set({ genres });
  },
  setCurrentGenre(genreId: number) {
    saveGenreToLocalStorage(genreId);
    set({ currentGenre: genreId });
  },
}));
