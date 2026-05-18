import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CrosswordView from '../CrosswordBoard';
import { fetchCrossword, finishGame } from '../../API';
import { buildTableFromWords } from '../boardBuilder';

export default function MainCrossword() {
    const loaded = useRef(false);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [crosswordData, setCrosswordData] = useState(null);
    const [error, setError] = useState(null);
    const [gameId, setGameId] = useState(null);

    // Stan do obsługi poddania
    const [isSurrendered, setIsSurrendered] = useState(false);

    const handleWin = async () => {
        if (isSurrendered) return;

        let earnedPoints = 0;
        if (gameId) {
            try {
                const result = await finishGame(gameId);
                earnedPoints = result.earned ?? 0;
            } catch (err) {
                console.warn('Nie udało się zapisać wyniku:', err.message);
            }
        }

        setTimeout(() => {
            Swal.fire({
                title: 'Gratki!',
                html: `
                    <div style="font-size: 60px; margin: 10px 0; letter-spacing: 10px;">🎉</div>
                    <div style="font-size: 18px; font-weight: 500; color: #334155;">
                        Udało Ci się rozwiązać całą krzyżówkę.
                    </div>
                    ${earnedPoints > 0 ? `
                    <div style="margin-top: 12px; font-size: 22px; font-weight: 800; color: #2563eb;">
                        +${earnedPoints} pkt 🏆
                    </div>` : ''}
                `,
                confirmButtonText: 'Powróć do menu',
                confirmButtonColor: '#2563eb',
                allowOutsideClick: false,
                allowEscapeKey: false,
                backdrop: `rgba(15, 23, 42, 0.8)`
            }).then((result) => {
                if (result.isConfirmed) navigate('/');
            });
        }, 150);
    };

    const handleSurrender = () => {
        Swal.fire({
            title: 'Na pewno chcesz się poddać?',
            text: 'Gra zostanie przerwana, a my wyświetlimy poprawne odpowiedzi.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444', // Czerwony dla akcji destrukcyjnej
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Tak, poddaję się',
            cancelButtonText: 'Wracam do gry',
            backdrop: `rgba(15, 23, 42, 0.8)`
        }).then((result) => {
            if (result.isConfirmed) {
                setIsSurrendered(true);
                // Opcjonalnie: if (gameId) finishGame(gameId, { surrendered: true }); 
            }
        });
    };

    useEffect(() => {
        if (loaded.current) return;
        loaded.current = true;
        const loadCrosswordData = async () => {
            try {
                const seedParam = searchParams.get('seed');
                const countParam = searchParams.get('count') || '10';
                const difficultyParam = searchParams.get('difficulty') || 'EASY';

                const { gameId: id, words } = await fetchCrossword(countParam, seedParam, difficultyParam);

                setGameId(id);

                const generatedTable = buildTableFromWords(words);
                setCrosswordData({
                    table: generatedTable,
                    words: words,
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

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.titleBox}>
                        <h2 style={styles.title}>
                            {isSurrendered ? 'Rozwiązanie krzyżówki' : 'Rozwiązujesz krzyżówkę'}
                        </h2>
                        <p style={styles.subtitle}>
                            <strong>Słowa:</strong> {crosswordData.words.length} •{' '}
                            <strong>Tryb:</strong> {crosswordData.usedSeed ? `Seed: ${crosswordData.usedSeed}` : 'Losowy'} •{' '}
                            <strong>Poziom:</strong> {crosswordData.difficulty}
                        </p>
                    </div>

                    {!isSurrendered && (
                        <button
                            style={styles.surrenderBtn}
                            onClick={handleSurrender}
                        >
                            🏳️ Poddaj
                        </button>
                    )}
                </div>

                {!isSurrendered ? (
                    <div style={styles.boardContainer}>
                        <CrosswordView
                            table={crosswordData.table}
                            words={crosswordData.words}
                            onWin={handleWin}
                        />
                    </div>
                ) : (
                    <div style={styles.answersContainer}>
                        <div style={styles.tableWrapper}>
                            <table style={styles.answersTable}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Niemiecki</th>
                                        <th style={styles.th}>Polski</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {crosswordData.words.map((w, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                                            <td style={styles.td}><strong>{w.answer}</strong></td>
                                            <td style={styles.td}>{w.polish}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button
                            style={{
                                ...styles.secondaryButton,
                                padding: '12px 24px',
                                fontSize: '15px',
                                alignSelf: 'center', // <-- To wyśrodkuje przycisk
                                marginTop: '10px'    // <-- Dodatkowy margines, żeby odsunąć go od tabeli
                            }}
                            onClick={() => navigate('/')}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#cbd5e1'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#e2e8f0'}
                        >
                            ← Wróć do menu
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
}

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
        boxSizing: 'border-box',
        transition: 'height 0.3s ease'
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
    titleBox: { display: 'flex', flexDirection: 'column', gap: '5px' },
    title: { margin: 0, fontSize: '24px', color: '#0f172a', fontWeight: 'bold' },
    subtitle: { margin: 0, fontSize: '15px', color: '#64748b' },
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
    surrenderBtn: {
        padding: '10px 20px',
        backgroundColor: '#fef2f2',
        color: '#dc2626',
        border: '1px solid #fca5a5',
        borderRadius: '10px',
        fontWeight: '700',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(220, 38, 38, 0.1)'
    },
    messageContainer: {
        textAlign: 'center',
        padding: '60px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingText: { fontSize: '18px', color: '#64748b', fontWeight: '500', margin: 0 },
    errorText: { color: '#ef4444', fontSize: '18px', fontWeight: '600', marginBottom: '25px', marginTop: 0 },
    boardContainer: {
        paddingBottom: '10px',
        animation: 'fadeIn 0.4s ease-out'
    },
    answersContainer: {
        width: '100%',
        animation: 'slideUp 0.4s ease-out',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    tableWrapper: {
        width: '100%',
        maxWidth: '800px',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        marginBottom: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    },
    answersTable: {
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: '15px'
    },
    th: {
        padding: '12px 16px',
        backgroundColor: '#f1f5f9',
        color: '#475569',
        fontWeight: '700',
        textTransform: 'uppercase',
        fontSize: '13px',
        letterSpacing: '0.05em'
    },
    td: {
        padding: '14px 16px',
        color: '#334155'
    }
};