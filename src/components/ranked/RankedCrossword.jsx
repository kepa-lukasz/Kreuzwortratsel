import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CrosswordView from '../CrosswordBoard';
// Zakładam, że masz te funkcje w api.js lub podobnym pliku
import { getRankingCrossword, finishRankingGame } from '../../API';
import { buildTableFromWords } from '../boardBuilder';

export default function RankingCrossword({onHint}) {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [hintsUsed, setHintsUsed] = useState(0);
    // Rozszerzony stan o dane rankingowe
    const [crosswordData, setCrosswordData] = useState(null);
    const [gameMetadata, setGameMetadata] = useState({ gameId: null, potentialPoints: 0 });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleHintUsed = () => {
        setHintsUsed(prev => prev + 1);
        console.log("Zużyto podpowiedź. Razem:", hintsUsed + 1);
    };


    // --- LOGIKA ZAKOŃCZENIA GRY ---
    const handleFinish = async (isSurrender = false) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            // W prawdziwym scenariuszu 'mistakes' pobrałbyś ze stanu komponentu CrosswordBoard
            // Na potrzeby logiki przyjmijmy 0 przy wygranej
            const mistakes = 0;

            const result = await finishRankingGame(gameMetadata.gameId, hintsUsed, isSurrender);
          

            Swal.fire({
                title: isSurrender ? 'Poddano grę' : 'Krzyżówka rozwiązana!',
                html: `
                    <div style="font-size: 50px; margin: 10px 0;">${isSurrender ? '🏳️' : '🏆'}</div>
                    <div style="font-size: 18px; color: #334155;">
                        Zdobyte punkty: <b>${result.earnedPoints}</b><br/>
                    </div>
                `,
                confirmButtonText: 'Wróć do menu',
                confirmButtonColor: '#2563eb',
                backdrop: `rgba(15, 23, 42, 0.9)`
            }).then(() => navigate('/rankings'));

        } catch (err) {
            Swal.fire('Błąd', 'Nie udało się zapisać wyniku sesji.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- ŁADOWANIE DANYCH Z API ---
    useEffect(() => {
        const loadRankingData = async () => {
            try {
                const diff = searchParams.get('difficulty') || 'MEDIUM';

                // Wywołujemy nasz nowy endpoint rankingowy
                const data = await getRankingCrossword(diff);
                

                // Budujemy siatkę z otrzymanych słów
                const generatedTable = buildTableFromWords(data.crosswordData);

                setCrosswordData({
                    table: generatedTable,
                    words: data.crosswordData,
                    difficulty: diff
                });

                setGameMetadata({
                    gameId: data.gameId,
                    potentialPoints: data.potentialPoints
                });

            } catch (err) {
                if (err.message === 'UNAUTHORIZED') {
                    navigate('/login', { state: { from: window.location.pathname + window.location.search } });
                } else {
                    setError(true);
                }
            }
        };

        loadRankingData();
    }, [searchParams, navigate]);

    // Renderowanie ekranów ładowania/błędu (identyczne jak w Twoim kodzie)
    if (error) return <ErrorScreen onBack={() => navigate('/ranking-config')} />;
    if (!crosswordData) return <LoadingScreen />;

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.card}>

                {/* Zmodyfikowany Header Rankingowy */}
                <div style={styles.header}>
                    <div style={styles.titleBox}>
                        <h2 style={styles.title}>🏆 Tryb Rankingowy</h2>
                        <p style={styles.subtitle}>
                            Grasz o: <strong style={{ color: '#2563eb' }}>{gameMetadata.potentialPoints} pkt</strong> •
                            Poziom: <strong>{crosswordData.difficulty}</strong>
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            style={styles.surrenderButton}
                            onClick={() => handleFinish(true)}
                        >
                            🏳️ Poddaj się
                        </button>
                    </div>
                </div>

                <div style={styles.boardContainer}>
                    <CrosswordView
                        table={crosswordData.table}
                        words={crosswordData.words}
                        onWin={() => handleFinish(false)}
                        onHint={handleHintUsed} 
                    />
                </div>
            </div>
        </div>
    );
}

// Pomocnicze mini-komponenty dla czytelności
const LoadingScreen = () => (
    <div style={styles.pageWrapper}>
        <div style={styles.card}><div style={styles.messageContainer}>⏳ Generowanie sesji rankingowej...</div></div>
    </div>
);

const ErrorScreen = ({ onBack }) => (
    <div style={styles.pageWrapper}>
        <div style={styles.card}>
            <div style={styles.messageContainer}>
                <p style={styles.errorText}>Błąd sesji. Upewnij się, że jesteś zalogowany.</p>
                <button style={styles.primaryButton} onClick={onBack}>Wróć</button>
            </div>
        </div>
    </div>
);

// DODANE STYLE DLA RANKINGU
const styles = {
    // ... weź wszystkie style ze swojego kodu i dodaj/zmień te:
    surrenderButton: {
        padding: '10px 16px',
        fontSize: '14px',
        fontWeight: 'bold',
        backgroundColor: '#fee2e2',
        color: '#ef4444',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    // (Reszta Twoich stylów poniżej...)
    pageWrapper: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', background: 'linear-gradient(135deg, #a4a5ff 0%, #8cb8ff 100%)', fontFamily: "'Segoe UI', sans-serif" },
    card: { backgroundColor: '#ffffff', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '85vw' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px', marginBottom: '30px' },
    titleBox: { display: 'flex', flexDirection: 'column', gap: '5px' },
    title: { margin: 0, fontSize: '24px', color: '#0f172a' },
    subtitle: { margin: 0, fontSize: '15px', color: '#64748b' },
    messageContainer: { textAlign: 'center', padding: '60px 20px' },
    errorText: { color: '#ef4444', fontWeight: 'bold', marginBottom: '20px' },
    primaryButton: { padding: '12px 24px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }
};