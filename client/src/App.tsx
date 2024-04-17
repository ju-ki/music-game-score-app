import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import './index.css';
import MusicList from './components/music';
import ScoresList from './components/score';
import MyList from './components/my-list';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/music/' element={<MusicList />} />
        <Route path='/scores/' element={<ScoresList />} />
        <Route path='/my-list/' element={<MyList />} />
      </Routes>
    </Router>
  );
}

export default App;
