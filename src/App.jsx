import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './auth/RegisterPage'; // O el path donde lo guardaste

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/registro" element={<RegisterPage />} />
        </Routes>
      </Router>
  );
}

export default App;