import { ReactNode, createContext, useContext, useState } from 'react';

type Genre = {
  id: number;
  name: string;
};

type GenreContextType = {
  genres: Genre[];
  currentGenre: number;
  setGenres: (genres: Genre[]) => void;
  setCurrentGenre: (genre: number) => void;
};

const GenreContext = createContext<GenreContextType | undefined>(undefined);

export const GenreProvider = ({ children }: { children: ReactNode }) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [currentGenre, setCurrentGenre] = useState<number>(1);

  return (
    <GenreContext.Provider value={{ genres, currentGenre, setGenres, setCurrentGenre }}>
      {children}
    </GenreContext.Provider>
  );
};

export const useGenre = () => {
  const context = useContext(GenreContext);
  if (!context) {
    throw new Error('useGenre must be used within a GenreProvider');
  }
  return context;
};
