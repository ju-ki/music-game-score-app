import { create } from 'zustand';
import axiosClient from '../../utils/axios';
import { CodeResponse } from '@react-oauth/google';
import { showToast } from '../common/Toast';

type User = {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  authority: string;
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
  checkLoginStatus: () => Promise<boolean>;
  handleGoogleLoginSuccess: (response: Omit<CodeResponse, 'error' | 'error_description' | 'error_uri'>) => void;
  handleGoogleLoginFailure: (error: Pick<CodeResponse, 'error' | 'error_description' | 'error_uri'>) => void;
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

const handleGoogleLoginSuccess = async (response: Omit<CodeResponse, 'error' | 'error_description' | 'error_uri'>) => {
  try {
    const { data } = await axiosClient.post(
      `${import.meta.env.VITE_APP_URL}/auth/google/login`,
      {
        code: response.code,
      },
      {
        withCredentials: true, //クッキーを含めるため
      },
    );
    useUserStore.getState().setAccessToken(data.accessToken);
    useUserStore.getState().setUser(data.user);
    useUserStore.getState().setIsLoggedIn(true);
    showToast('success', 'ログインに成功しました');
  } catch (err) {
    console.log(err);
    useUserStore.getState().setIsLoggedIn(false);
    showToast('error', 'ログインに失敗しました');
  }
};

const handleGoogleLoginFailure = (error: Pick<CodeResponse, 'error' | 'error_description' | 'error_uri'>) => {
  console.error('Google login error:', error);
  showToast('error', 'ログインに失敗しました');
};

async function checkLoginStatus(): Promise<boolean> {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    return false;
  }

  const user = useUserStore.getState().user;

  try {
    const isValid = await axiosClient.get(`${import.meta.env.VITE_APP_URL}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        userId: user?.id || null,
      },
      withCredentials: true,
    });

    useUserStore.getState().setIsLoggedIn(isValid.data);

    return isValid.data;
  } catch (error) {
    console.log('Token validation failed:', error);
    return false;
  }
}

export const useUserStore = create<UserStore>((set) => ({
  user: loadUserFromLocalStorage(),
  accessToken: '',
  refreshToken: '',
  isLoggedIn: false,
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
    saveUserToLocalStorage(user);
    set({ user, isLoggedIn: true });
  },
  logout: () => {
    saveUserToLocalStorage(null);
    set({ user: null, isLoggedIn: false });
  },
  checkLoginStatus: () => {
    return checkLoginStatus();
  },
  handleGoogleLoginSuccess: (response: Omit<CodeResponse, 'error' | 'error_description' | 'error_uri'>) => {
    handleGoogleLoginSuccess(response);
  },
  handleGoogleLoginFailure: (error: Pick<CodeResponse, 'error' | 'error_description' | 'error_uri'>) => {
    handleGoogleLoginFailure(error);
  },
}));
