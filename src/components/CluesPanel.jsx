import React, { useState, useEffect } from 'react';

export default function CluesPanel({ words, onHint }) {
    const [revealed, setRevealed] = useState({});
    // Resetujemy podpowiedzi, kiedy ładuje się nowa krzyżówka
    useEffect(() => {
        setRevealed({});
    }, [words]);

    const handleReveal = (pos, maxLen) => {
        if (onHint) {
        onHint();
    }
        setRevealed(prev => {
            const current = prev[pos] || 0;
            // Zwiększamy o 1 tylko, jeśli nie odkryliśmy jeszcze całego słowa
            if (current < maxLen) {
                return { ...prev, [pos]: current + 1 };
            }
            return prev;
        });
    };

    return (
        <div style={styles.cluesContainer}>
            <h3 style={styles.heading}>Podpowiedzi:</h3>
            <ul style={styles.cluesList}>
                {words.map((wordObj) => {
                    // Dostosowanie do obiektu z Twojego API:
                    // answer: "OHR", polish: "ucho", position: 1
                    const germanWord = wordObj.answer || ""; 
                    const clueText = wordObj.polish || "Brak tłumaczenia";
                    const pos = wordObj.position;
                    
                    const revealedCount = revealed[pos] || 0;
                    
                    // Odkryta część słowa
                    const revealedText = germanWord.substring(0, revealedCount).toUpperCase();
                    // Ukryta część słowa (podkreślniki)
                    const hiddenText = germanWord.substring(revealedCount).replace(/./g, '_ ');

                    return (
                        <li key={pos} style={styles.clueItem}>
                            <div style={styles.clueHeader}>
                                <span>
                                    {/* Używamy pozycji z backendu */}
                                    <strong>{pos}.</strong> {clueText}
                                </span>
                                
                                <button 
                                    onClick={() => handleReveal(pos, germanWord.length)}
                                    disabled={revealedCount === germanWord.length}
                                    style={{
                                        ...styles.revealBtn,
                                        opacity: revealedCount === germanWord.length ? 0.3 : 1,
                                        cursor: revealedCount === germanWord.length ? 'default' : 'pointer'
                                    }}
                                    title="Pokaż literę"
                                >
                                    +
                                </button>
                            </div>

                            {/* Pokazujemy podpowiedź (np. "A u _ _ ") */}
                            <div style={styles.hintText}>
                                <span style={{ letterSpacing: '3px', fontWeight: 'bold', color: '#15803d' }}>
                                    {revealedText}
                                </span>
                                <span style={{ letterSpacing: '1px', color: '#94a3b8' }}>
                                    {hiddenText}
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

const styles = {
    cluesContainer: {
        backgroundColor: '#f8fafc', // Delikatnie jaśniejszy, nowoczesny kolor
        padding: '20px',
        borderRadius: '12px',

        // overflowY: 'auto', // Dodajemy scroll, jeśli podpowiedzi jest dużo
        boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)'
    },
    heading: {
        marginTop: 0,
        marginBottom: '20px',
        color: '#1e293b',
        fontSize: '20px',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '10px'
    },
    cluesList: {
        listStyleType: 'none',
        padding: 0,
        margin: 0
    },
    clueItem: {
        marginBottom: '18px',
        borderBottom: '1px solid #f1f5f9',
        paddingBottom: '12px'
    },
    clueHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
        fontSize: '16px',
        color: '#334155'
    },
    revealBtn: {
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '26px',
        height: '26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '18px',
        lineHeight: '1',
        transition: 'all 0.2s ease'
    },
    hintText: {
        fontSize: '15px',
        fontFamily: 'monospace',
        backgroundColor: '#fff',
        padding: '6px 10px',
        borderRadius: '6px',
        border: '1px dashed #cbd5e1',
        display: 'inline-block',
        minWidth: '100px'
    }
};