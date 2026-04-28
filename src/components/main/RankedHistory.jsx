import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyHistory } from '../../API';
import { FaSignOutAlt } from "react-icons/fa";

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

    if (loading) return <div style={styles.loader}>Wczytywanie Twoich sukcesów... ⏳</div>;


    const renderStatus = (game) => {
    // 1. Jeśli gra nie jest zakończona
    if (!game.isFinished) {
        return (
            <span style={{ color: '#64748b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <FaSignOutAlt color="#64748b"/> Porzucona
            </span>
        );
    }
    
    // 2. Jeśli jest zakończona, ale punkty to 0 (Poddanie)
    if (game.finalPoints === 0) {
        return (
            <span style={{ color: '#ef4444', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                🏳️ Poddanie
            </span>
        );
    }

    // 3. Jeśli jest zakończona i punkty > 0 (Sukces)
    return (
        <span style={{ color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
            ✅ Sukces
        </span>
    );
};

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Moja Historia Rankingowa 🏆</h1>
                    <button style={styles.backBtn} onClick={() => navigate('/')}>Wróć</button>
                </div>

                {history.length === 0 ? (
                    <p style={styles.emptyText}>Nie rozegrałeś jeszcze żadnej gry rankingowej. Czas to zmienić! 🚀</p>
                ) : (
                    <div style={styles.list}>
                        {history.map(game => (
                            <div key={game.id} style={styles.historyRow}>
                                {/* Oneliner: Data */}
                                <div style={styles.oneliner}>
                                    <span style={styles.icon}>📅</span>
                                    <span style={styles.dateText}>
                                        {new Date(game.date).toLocaleDateString()} {new Date(game.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>

                                {/* Trudność */}
                                <div style={styles.badge(game.difficulty)}>
                                    {game.difficulty}
                                </div>

                                {/* Oneliner: Punkty */}
                                <div style={styles.oneliner}>
                                    <span style={styles.icon}>🎯</span>
                                    <span style={styles.pointsText}>
                                        <b>{game.finalPoints}</b> / {game.potentialPoints} pkt
                                    </span>
                                </div>

                                {/* Oneliner: Podpowiedzi */}
                                <div style={styles.oneliner}>
                                    <span style={styles.icon}>💡</span>
                                    <span>{game.hints || 0}</span>
                                </div>

                                {/* Status */}
                                <div style={styles.oneliner}>
                                    {renderStatus(game)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    pageWrapper: {
        minHeight: '30vh',
        background: 'linear-gradient(135deg, #a4a5ff 0%, #8cb8ff 100%)',
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 20px',
        fontFamily: 'Segoe UI, sans-serif'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '30px',
        width: '100%',
        maxWidth: '900px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px',
        borderBottom: '2px solid #f1f5f9',
        paddingBottom: '15px'
    },
    title: { fontSize: '24px', color: '#1e293b', margin: 0 },
    backBtn: { padding: '8px 15px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: '#e2e8f0' },
    list: { display: 'flex', flexDirection: 'column', gap: '12px' },
    historyRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '15px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        transition: 'transform 0.2s',
        border: '1px solid #e2e8f0',
        flexWrap: 'wrap',
        gap: '10px'
    },
    oneliner: { display: 'flex', alignItems: 'center', gap: '8px', minWidth: '120px' },
    icon: { fontSize: '18px' },
    dateText: { fontSize: '14px', color: '#64748b' },
    pointsText: { fontSize: '15px' },
    badge: (diff) => ({
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 'bold',
        backgroundColor: diff === 'HARD' ? '#fee2e2' : diff === 'MEDIUM' ? '#fef3c7' : '#dcfce7',
        color: diff === 'HARD' ? '#991b1b' : diff === 'MEDIUM' ? '#92400e' : '#166534',
        minWidth: '70px',
        textAlign: 'center'
    }),
    loader: { textAlign: 'center', marginTop: '100px', fontSize: '20px' },
    emptyText: { textAlign: 'center', padding: '40px', color: '#64748b' }
};