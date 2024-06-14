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
  if (genreId) {
    localStorage.setItem('genre', JSON.stringify(genreId));
  }
};

const loadGenreFromLocalStorage = () => {
  const genre = localStorage.getItem('genre');
  return genre ? JSON.parse(genre) : null;
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
