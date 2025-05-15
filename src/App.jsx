import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx';
import './styles/global.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                {/* Agrega otras rutas cuando lo necesites */}
            </Routes>
        </Router>
    );
}

export default App;
