import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './components/home';
import './index.css';
import MusicList from './components/music';
import ScoresList from './components/score/view';
import MyList from './components/my-list';
import RegisterMusicScore from './components/score/register';
import MusicScoreList from './components/score/detail';
import MyListDetail from './components/my-list/detail';
import AdminTop from './components/admin/top';
import AdminUser from './components/admin/users';
import AdminMusic from './components/admin/musics';
import PrivateRoute from './lib/PrivateRoute';
import AuthRoute from './lib/AuthRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        <Router>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path='/my-list/' element={<MyList />} />
              <Route path='/music/' element={<MusicList />} />
              <Route path='/scores/' element={<ScoresList />} />
              <Route path='/register-music-score/' element={<RegisterMusicScore />} />
              <Route path='/register-music-score/:musicId' element={<RegisterMusicScore />} />
              <Route path='/register-music-score/:musicId/:musicDifficulty' element={<RegisterMusicScore />} />
              <Route path='/edit-score/:scoreId' element={<RegisterMusicScore />} />
              <Route path='/score/:musicId/:musicDifficulty' element={<MusicScoreList />} />
              <Route path='/my-list/:myListId' element={<MyListDetail />} />
            </Route>
            <Route element={<AuthRoute />}>
              <Route path='/admin' element={<AdminTop />} />
              <Route path='/admin/users' element={<AdminUser />} />
              <Route path='/admin/musics' element={<AdminMusic />} />
            </Route>
            <Route path='/' element={<Home />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </>
  );
}

export default App;
