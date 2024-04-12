import { create } from 'zustand';

type User = {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
};

type UserStore = {
  user: User | null;
  isLoggedIn: boolean;
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

// Function to load user data from localStorage
const loadUserFromLocalStorage = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: loadUserFromLocalStorage(), // Load user data from localStorage on initialization
  isLoggedIn: loadUserFromLocalStorage() != null,
  setUser: (user: User) => {
    saveUserToLocalStorage(user); // Save user data to localStorage whenever it's updated
    set({ user, isLoggedIn: true });
  },
  logout: () => {
    saveUserToLocalStorage(null); // Clear user data from localStorage on logout
    set({ user: null, isLoggedIn: false });
  },
}));
