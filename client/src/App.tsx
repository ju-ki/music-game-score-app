import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './components/home';
import './index.css';
import MusicList from './components/music';
import ScoresList from './components/score';
import MyList from './components/my-list';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/music/' element={<MusicList />} />
            <Route path='/scores/' element={<ScoresList />} />
            <Route path='/my-list/' element={<MyList />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </>
  );
}

export default App;
