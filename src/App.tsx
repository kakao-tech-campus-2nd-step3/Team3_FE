import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TempPage from './pages/TempPage';
import 'normalize.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TempPage />} />
        {/* route추가예정... */}
      </Routes>
    </Router>
  );
}

export default App
