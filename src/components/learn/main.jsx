// src/components/MainCrossword.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CrosswordView from '../CrosswordBoard';
import { fetchCrossword } from '../crossword_API';
import { buildTableFromWords } from '../boardBuilder';

export default function MainCrossword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [crosswordData, setCrosswordData] = useState(null);
    const [error, setError] = useState(null);

    const handleWin = () => {
        setTimeout(() => {
            Swal.fire({
                title: 'Gratki!',
                html: `
                    <div style="font-size: 60px; margin: 10px 0; letter-spacing: 10px;">
                        🎉
                    </div>
                    <div style="font-size: 18px; font-weight: 500; color: #334155;">
                        Udało Ci się rozwiązać całą krzyżówkę.
                    </div>
                `,
                confirmButtonText: 'Powróć do menu',
                confirmButtonColor: '#2563eb',
                allowOutsideClick: false, 
                allowEscapeKey: false,
                backdrop: `rgba(15, 23, 42, 0.8)`
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/');
                }
            });
        }, 150);
    };

    useEffect(() => {
        const loadCrosswordData = async () => {
            try {
                // Pobieranie parametrów z URL
                const seedParam = searchParams.get('seed');
                const countParam = searchParams.get('count') || '10';
                const difficultyParam = searchParams.get('difficulty') || 'EASY';

                // 1. Oczekiwanie na czystą tablicę obiektów z API
                const wordsArray = await fetchCrossword(countParam, seedParam, difficultyParam);

                // 2. Budowanie siatki (grid) za pomocą zewnętrznego narzędzia
                const generatedTable = buildTableFromWords(wordsArray);

                // 3. Aktualizacja stanu aplikacji
                setCrosswordData({
                    table: generatedTable,
                    words: wordsArray,
                    usedSeed: seedParam,
                    requestedCount: parseInt(countParam, 10),
                    difficulty: difficultyParam
                });

            } catch (err) {
                console.error("Błąd podczas generowania krzyżówki:", err);
                setError(true);
            }
        };

        loadCrosswordData();
    }, [searchParams]);
    
    // Ekran błędu
    if (error) {
        return (
            <div style={styles.pageWrapper}>
                <div style={styles.card}>
                    <div style={styles.messageContainer}>
                        <div style={{ fontSize: '40px', marginBottom: '15px' }}>🧩</div>
                        <p style={styles.errorText}>Nie udało się ułożyć krzyżówki. Spróbuj innych ustawień.</p>
                        <button 
                            style={styles.primaryButton} 
                            onClick={() => navigate('/')}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
                        >
                            Wróć do ustawień
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Ekran ładowania
    if (!crosswordData) {
        return (
            <div style={styles.pageWrapper}>
                <div style={styles.card}>
                    <div style={styles.messageContainer}>
                        <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
                        <p style={styles.loadingText}>Trwa łączenie z serwerem i generowanie krzyżówki...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Właściwy ekran krzyżówki
    return (
        <div style={styles.pageWrapper}>
            <div style={styles.card}>
                
                {/* Górny pasek informacyjny */}
                <div style={styles.header}>
                    <div style={styles.titleBox}>
                        <h2 style={styles.title}>Rozwiązujesz krzyżówkę</h2>
                        <p style={styles.subtitle}>
                            <strong>Słowa:</strong> {crosswordData.words.length} • 
                            <strong> Tryb:</strong> {crosswordData.usedSeed ? `Seed: ${crosswordData.usedSeed}` : 'Losowy'} • 
                            <strong> Poziom:</strong> {crosswordData.difficulty}
                        </p>
                    </div>
                    <button 
                        style={styles.secondaryButton} 
                        onClick={() => navigate('/')}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#cbd5e1'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#e2e8f0'}
                    >
                        ← Wróć do menu
                    </button>
                </div>

                {/* Pojemnik z krzyżówką */}
                <div style={styles.boardContainer}>
                    <CrosswordView
                        table={crosswordData.table}
                        words={crosswordData.words}
                        onWin={handleWin}
                    />
                </div>
                
            </div>
        </div>
    );
}

// TUTAJ WKLEJ SWÓJ OBIEKT const styles = { ... }
// Style pozostają bez zmian
const styles = {
    pageWrapper: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #a4a5ff 0%, #8cb8ff 100%)',
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        boxSizing: 'border-box'
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05), 0 4px 10px rgba(0, 0, 0, 0.03)',
        width: '100%',
        maxWidth: '85vw', 
        boxSizing: 'border-box'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid #f1f5f9',
        paddingBottom: '20px',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '15px'
    },
    titleBox: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    },
    title: {
        margin: 0,
        fontSize: '24px',
        color: '#0f172a',
        fontWeight: 'bold'
    },
    subtitle: {
        margin: 0,
        fontSize: '15px',
        color: '#64748b'
    },
    primaryButton: {
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: 'bold',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)'
    },
    secondaryButton: {
        padding: '10px 16px',
        fontSize: '14px',
        fontWeight: 'bold',
        backgroundColor: '#e2e8f0',
        color: '#475569',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    messageContainer: {
        textAlign: 'center',
        padding: '60px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingText: {
        fontSize: '18px',
        color: '#64748b',
        fontWeight: '500',
        margin: 0
    },
    errorText: {
        color: '#ef4444',
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '25px',
        marginTop: 0
    },
    boardContainer: {
        paddingBottom: '10px'
    }
};