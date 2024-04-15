import { create } from 'zustand';

type User = {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
};

type UserStore = {
  user: User | null;
  accessToken: string;
  refreshToken: string;
  isLoggedIn: boolean;
  setIsLoggedIn: (flg: boolean) => void;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
};

const saveUserToLocalStorage = (user: User | null) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

const loadUserFromLocalStorage = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

const saveAccessToken = (accessToken: string | null) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  } else {
    localStorage.removeItem('accessToken');
  }
};

const saveRefreshAccessToken = (refreshToken: string | null) => {
  if (refreshToken) {
    localStorage.setItem('refreshAccessToken', refreshToken);
  } else {
    localStorage.removeItem('refreshAccessToken');
  }
};

export const useUserStore = create<UserStore>((set) => ({
  user: loadUserFromLocalStorage(),
  accessToken: '',
  refreshToken: '',
  isLoggedIn: loadUserFromLocalStorage() != null,
  setIsLoggedIn: (flg) => {
    set({ isLoggedIn: flg });
  },
  setAccessToken(accessToken) {
    saveAccessToken(accessToken);
    set({ accessToken: accessToken });
  },
  setRefreshToken(refreshToken) {
    saveRefreshAccessToken(refreshToken);
    set({ refreshToken: refreshToken });
  },
  setUser: (user: User) => {
    saveUserToLocalStorage(user); // Save user data to localStorage whenever it's updated
    set({ user, isLoggedIn: true });
  },
  logout: () => {
    saveUserToLocalStorage(null); // Clear user data from localStorage on logout
    set({ user: null, isLoggedIn: false });
  },
}));
