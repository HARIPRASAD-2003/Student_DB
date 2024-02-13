// import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import DashBoard from './pages/DashBoard';
import Navbar from './Components/Navbar';
import Students from './pages/Students';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" Component={DashBoard} />
        <Route path="/dept/:id" Component={Students} />
      </Routes>
    </Router>
  );
}

export default App;
