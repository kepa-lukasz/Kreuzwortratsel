import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyHistory } from '../../API';
import { FaSignOutAlt, FaPlay, FaCheckCircle, FaFlag } from "react-icons/fa";
import { LuGrid2X2Check, LuTextSearch, LuLayers, LuBookText } from "react-icons/lu";

export default function RankingHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getMyHistory()
            .then(data => {
                setHistory(data);
                setLoading(false);
            })
            .catch(err => {
                if (err.message === 'UNAUTHORIZED') {
                    navigate('/login', { state: { from: '/history' } });
                } else {
                    setError("Nie udało się załadować historii.");
                    setLoading(false);
                }
            });
    }, [navigate]);

    const renderStatus = (game) => {
        if (!game.finished) {
            return (
                <span style={styles.statusBadge('#64748b', '#f1f5f9')}>
                    <FaSignOutAlt size={11} /> Porzucona
                </span>
            );
        }
        if (game.points === 0) {
            return (
                <span style={styles.statusBadge('#dc2626', '#fef2f2')}>
                    <FaFlag size={11} /> Poddanie
                </span>
            );
        }
        return (
            <span style={styles.statusBadge('#059669', '#ecfdf5')}>
                <FaCheckCircle size={11} /> Sukces
            </span>
        );
    };

    const difficultyConfig = {
        HARD: { bg: '#fee2e2', color: '#991b1b', label: '🔴 Trudny' },
        MEDIUM: { bg: '#fef3c7', color: '#92400e', label: '🟡 Średni' },
        EASY: { bg: '#dcfce7', color: '#166534', label: '🟢 Łatwy' },
    };

const modeLabel = (mode) => {
        const config = {
            CROSSWORD: { label: 'Krzyżówki', icon: <LuGrid2X2Check size={16} /> },
            WORD_SEARCH: { label: 'Wykreślanki', icon: <LuTextSearch size={16} /> },
            FLASHCARDS: { label: 'Fiszki', icon: <LuLayers size={16} /> },
            STORIES: { label: 'Historie', icon: <LuBookText size={16} /> },
        };

        const currentMode = config[mode];

        // Fallback w razie nieznanego trybu
        if (!currentMode) return <span>{mode}</span>;

        return (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                {currentMode.icon}
                {currentMode.label}
            </span>
        );
    };

    if (loading) return (
        <div style={styles.pageWrapper}>
            <div style={styles.loaderCard}>
                <div style={styles.spinner} />
                <p style={{ color: '#64748b', marginTop: '16px' }}>Wczytywanie historii...</p>
            </div>
            {/* Zostawiamy mały tag na animację loadera, bo inline styles nie ogarną @keyframes */}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (error) return (
        <div style={styles.pageWrapper}>
            <div style={styles.loaderCard}>
                <p style={{ color: '#dc2626' }}>{error}</p>
                <button style={styles.backBtn} onClick={() => navigate('/')}>Wróć</button>
            </div>
        </div>
    );

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.card}>
                {/* Header */}
                <div style={styles.header}>
                    <div >
                        <h1 style={styles.title}>Historia gier 🏆</h1>
                        <p style={styles.subtitle}>{history.length} {history.length === 1 ? 'rozgrywka' : 'rozgrywek'}</p>
                    </div>
                    {/* <button style={styles.backBtn} onClick={() => navigate('/')}>← Wróć</button> */}
                </div>
                <div>

                    {/* Cards Grid */}
                    {history.length === 0 ? (
                        <div style={styles.emptyState}>
                            <div style={styles.emptyIcon}>🎮</div>
                            <p style={styles.emptyTitle}>Brak rozgrywek</p>
                            <p style={styles.emptySubtitle}>Nie rozegrałeś jeszcze żadnej gry. Czas to zmienić!</p>
                            <button style={styles.playBtn} onClick={() => navigate('/create-game')}>
                                Zacznij grę
                            </button>
                        </div>
                    ) : (
                        <div style={styles.historyGrid}>
                            {history.map((game) => {
                                const diff = difficultyConfig[game.difficulty] || difficultyConfig.EASY;
                                return (
                                    <div key={game.id} style={styles.gameCard}>

                                        {/* Card Header (Data + Status) */}
                                        <div style={styles.cardTop}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={styles.dateMain}>
                                                    {new Date(game.createdAt).toLocaleDateString('pl-PL', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                </span>
                                                <span style={styles.dateTime}>
                                                    {new Date(game.createdAt).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div>
                                                {renderStatus(game)}
                                            </div>
                                        </div>

                                        {/* Card Body (Parametry gry) */}
                                        <div style={styles.cardBody}>
                                            <div style={styles.infoItem}>
                                                <span style={styles.infoLabel}>Tryb</span>
                                                {modeLabel(game.mode)}
                                            </div>
                                            <div style={styles.infoItem}>
                                                <span style={styles.infoLabel}>Trudność</span>
                                                <span style={{
                                                    padding: '2px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '11px',
                                                    fontWeight: '700',
                                                    backgroundColor: diff.bg,
                                                    color: diff.color,
                                                    display: 'inline-block'
                                                }}>
                                                    {diff.label}
                                                </span>
                                            </div>
                                            <div style={styles.infoItem}>
                                                <span style={styles.infoLabel}>Maksymalna Liczba pytań</span>
                                                <span style={styles.infoValue}>{game.count}</span>
                                            </div>
                                        </div>

                                        {/* Card Footer (Punkty + Akcja) */}
                                        <div style={styles.cardFooter}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={styles.infoLabel}>Zdobyte punkty</span>
                                                <span style={styles.pointsText}>{game.points} <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '500' }}>pkt</span></span>
                                            </div>
                                            <button
                                                style={styles.replayBtn}
                                                onClick={() => navigate(`/crossword?count=${game.count}&difficulty=${game.difficulty}&seed=${game.seed}`)}
                                                title="Zagraj ponownie z tymi samymi ustawieniami"
                                            >
                                                <FaPlay size={10} /> Graj
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    pageWrapper: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #a4a5ff 0%, #8cb8ff 100%)',
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 20px',
        fontFamily: "'Segoe UI', sans-serif",
        boxSizing: 'border-box',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '30px',
        width: '100%',
        width: '80vw',
        boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
        alignSelf: 'flex-start',
    },
    loaderCard: {
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '60px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
    },
    spinner: {
        width: '36px',
        height: '36px',
        border: '3px solid #e2e8f0',
        borderTop: '3px solid #8cb8ff',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
    header: {
        paddingBottom: '20px',
    },
    title: { fontSize: '24px', color: '#1e293b', margin: 0, fontWeight: '800', textAlign: "center", width: "100%" },
    subtitle: { fontSize: '14px', color: '#94a3b8', margin: '4px 0 0 0', textAlign: "center", width: "100%" },
    backBtn: {
        padding: '8px 16px',
        borderRadius: '10px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: '#f1f5f9',
        color: '#475569',
        fontWeight: '600',
        fontSize: '13px',
        transition: 'background 0.15s',
    },
    // ---- NOWE STYLE DLA SIATKI I KART ----
    historyGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
        paddingTop: '10px',
    },
    gameCard: {
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    },
    cardTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: '12px',
    },
    cardBody: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
    },
    infoItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    infoLabel: {
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: '#94a3b8',
        fontWeight: '700',
    },
    infoValue: {
        fontSize: '13px',
        color: '#334155',
        fontWeight: '600',
    },
    cardFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
        paddingTop: '16px',
        borderTop: '1px dashed #e2e8f0',
    },
    // --------------------------------------
    dateMain: { fontSize: '14px', color: '#0f172a', fontWeight: '700' },
    dateTime: { fontSize: '12px', color: '#64748b', marginTop: '2px' },
    pointsText: { fontSize: '22px', color: '#6366f1', fontWeight: '800', lineHeight: '1' },
    statusBadge: (color, bg) => ({
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '700',
        color,
        backgroundColor: bg,
        whiteSpace: 'nowrap',
    }),
    replayBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '10px 16px',
        borderRadius: '10px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: '#6366f1',
        color: 'white',
        fontSize: '13px',
        fontWeight: '700',
        boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)',
    },
    playBtn: {
        marginTop: '16px',
        padding: '12px 24px',
        borderRadius: '10px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: '#6366f1',
        color: 'white',
        fontSize: '15px',
        fontWeight: '700',
        boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)',
    },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '60px 20px',
    },
    emptyIcon: { fontSize: '48px', marginBottom: '16px' },
    emptyTitle: { fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px' },
    emptySubtitle: { fontSize: '15px', color: '#64748b', margin: 0 },
};