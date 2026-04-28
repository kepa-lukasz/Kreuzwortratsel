import React, { useState, useEffect } from 'react';
import { fetchRanking } from '../../API';

export const RankingsScreen = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadRanking = async () => {
            try {
                const data = await fetchRanking();
                setPlayers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadRanking();
    }, []);

    // Funkcja pomocnicza do wyświetlania ikon dla top 3
    const getRankIcon = (index) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return `${index + 1}.`;
    };

    if (loading) return <div style={styles.loader}>Ładowanie wyników...</div>;

    return (
        <div style={styles.screenWrapper}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>🏆 Ranking Graczy</h2>
                    <p style={styles.subtitle}>Najlepsi z najlepszych w Lern Deutsch</p>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                <div style={styles.table}>

                    {players.length > 0 ? (
                        players.map((player, index) => (
                            <div key={index} style={{
                                ...styles.tableRow,
                                ...(index < 3 ? styles.topThreeRow : {})
                            }}>
                                <span style={styles.colRank}>{getRankIcon(index)}</span>
                                <span style={styles.colUser}>{player.username}</span>
                                <span style={styles.colPoints}>{player.points.toLocaleString()}</span>
                            </div>
                        ))
                    ) : (
                        <div style={styles.noData}>Brak wyników do wyświetlenia.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    screenWrapper: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box'
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '600px',
        padding: '40px',
        boxSizing: 'border-box'
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px'
    },
    title: {
        margin: '0',
        fontSize: '28px',
        color: '#1e293b',
        fontWeight: '800'
    },
    subtitle: {
        margin: '5px 0 0 0',
        color: '#64748b',
        fontSize: '15px'
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    tableHeader: {
        display: 'flex',
        padding: '10px 15px',
        color: '#94a3b8',
        fontSize: '13px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    tableRow: {
        display: 'flex',
        alignItems: 'center',
        padding: '16px 20px',
        backgroundColor: '#f8fafc',
        borderRadius: '14px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        border: '1px solid #f1f5f9'
    },
    topThreeRow: {
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    },
    colRank: { width: '80px', fontWeight: 'bold', fontSize: '18px' },
    colUser: { flex: 1, fontWeight: '600', color: '#334155' },
    colPoints: { width: '100px', textAlign: 'right', fontWeight: '800', color: '#2563eb' },
    loader: { textAlign: 'center', padding: '50px', color: 'white', fontWeight: 'bold' },
    error: { color: '#ef4444', textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' },
    noData: { textAlign: 'center', padding: '30px', color: '#94a3b8' }
};