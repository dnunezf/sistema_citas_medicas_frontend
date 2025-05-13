import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import RegistroUsuario from './components/RegistroUsuario';
import './styles/global.css';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/registro" element={<RegistroUsuario />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
