import { create } from 'zustand';

export type Difficulty = {
  id: number;
  difficulty: SekaiDifficulty | YumesuteDifficulty;
  genreId: number;
};

type SekaiDifficulty = 'easy' | 'normal' | 'hard' | 'expert' | 'master' | 'append';
type YumesuteDifficulty = 'normal' | 'hard' | 'extra' | 'stella' | 'olivier';

type DifficultyStore = {
  difficulties: Difficulty[] | [];
  currentDifficulty: Difficulty | null;
  setDifficulties: (difficulties: Difficulty[]) => void;
  setCurrentDifficulty: (difficulty: Difficulty) => void;
  loadCurrentDifficulty: (genreId: number) => void;
};

const saveDifficultyToLocalStorage = (difficulty: Difficulty) => {
  try {
    const genreId = difficulty.genreId;
    localStorage.setItem(`difficulty-${genreId}`, JSON.stringify({ id: difficulty.id }));
  } catch (err) {
    console.error(err);
  }
};

const loadDifficultyFromLocalStorage = (genreId: number, difficulties: Difficulty[]) => {
  try {
    const storedData = localStorage.getItem(`difficulty-${genreId}`);
    if (storedData) {
      const { id } = JSON.parse(storedData);
      return difficulties.find((difficulty) => difficulty.id === id) || null;
    }
  } catch (err) {
    console.error(err);
  }
};

export const useDifficulty = create<DifficultyStore>((set, get) => ({
  difficulties: [],
  currentDifficulty: null,
  setDifficulties(difficulties: Difficulty[]) {
    set({ difficulties });
  },
  setCurrentDifficulty(difficulty: Difficulty) {
    saveDifficultyToLocalStorage(difficulty);
    set({ currentDifficulty: difficulty });
  },
  loadCurrentDifficulty(genreId: number) {
    const { difficulties } = get();
    const difficulty = loadDifficultyFromLocalStorage(genreId, difficulties);
    set({ currentDifficulty: difficulty });
  },
}));
