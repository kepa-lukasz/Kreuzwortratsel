// src/App.js
import React, { useState } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import MainCrossword from './components/main';

// Ekran startowy z opcjami
function ConfigScreen() {
    const [inputCount, setInputCount] = useState('10');
    const [inputSeed, setInputSeed] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Budujemy parametry linku
        const params = new URLSearchParams();
        params.set('count', inputCount);
        if (inputSeed.trim() !== '') {
            params.set('seed', inputSeed.trim());
        }

        // Przekierowujemy do komponentu krzyżówki z parametrami
        navigate(`/crossword?${params.toString()}`);
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
            <h2 style={{ marginTop: 0 }}>Ustawienia gry</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontWeight: 'bold' }}>Ilość słów (1-30):</label>
                    <input 
                        type="number" 
                        min="1" max="30"
                        value={inputCount}
                        onChange={(e) => setInputCount(e.target.value)}
                        style={{ padding: '8px', fontSize: '16px' }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontWeight: 'bold' }}>Ziarno (Seed):</label>
                    <input 
                        type="text" 
                        placeholder="Puste = losowa krzyżówka"
                        value={inputSeed}
                        onChange={(e) => setInputSeed(e.target.value)}
                        style={{ padding: '8px', fontSize: '16px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px', fontSize: '16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Zacznij naukę
                </button>
            </form>
        </div>
    );
}

// Główny komponent aplikacji
export default function App() {
    return (
        <HashRouter>
            <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
                <header style={{ borderBottom: '1px solid #ccc', marginBottom: '30px', paddingBottom: '10px' }}>
                    <h1>Lern Deutsch - Krzyżówka</h1>
                </header>

                <main>
                    <Routes>
                        <Route path="/" element={<ConfigScreen />} />
                        <Route path="/crossword" element={<MainCrossword />} />
                    </Routes>
                </main>
            </div>
        </HashRouter>
    );
}