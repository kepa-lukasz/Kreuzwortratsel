import React, { useState, useEffect } from 'react';

export default function CluesPanel({ words,  }) {
    console.log(words);
    
    const [revealed, setRevealed] = useState({});

    // Resetujemy podpowiedzi, kiedy ładuje się nowa krzyżówka
    useEffect(() => {
        setRevealed({});
    }, [words]);

    const handleReveal = (idx, maxLen) => {
        setRevealed(prev => {
            const current = prev[idx] || 0;
            // Zwiększamy o 1 tylko, jeśli nie odkryliśmy jeszcze całego słowa
            if (current < maxLen) {
                return { ...prev, [idx]: current + 1 };
            }
            return prev;
        });
    };

    return (
        <div style={styles.cluesContainer}>
            <h3 style={styles.heading}>Podpowiedzi:</h3>
            <ul style={styles.cluesList}>
                {words.map((wordObj, idx) => {
                    // Ponieważ w CrosswordView dodaliśmy pole "id", używamy go,
                    // w przeciwnym razie ratujemy się indexem tablicy.
                    const germanWord = wordObj.word || ""; 
                    const revealedCount = revealed[idx] || 0;
                    
                    // Odkryta część słowa
                    const revealedText = germanWord.substring(0, revealedCount);

                    const hiddenText = germanWord.substring(revealedCount).replace(/./g, '_ ');

                    return (
                        <li key={wordObj.clue} style={styles.clueItem}>
                            <div style={styles.clueHeader}>
                                <span>
                                    <strong>{idx}.</strong> {wordObj.clue}
                                </span>
                                
                                <button 
                                    onClick={() => handleReveal(idx, germanWord.length)}
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
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        minWidth: '250px',
        overflowY: 'scroll',
        maxHeight: '80vh',
        border: "1px solid red"
    },
    heading: {
        marginTop: 0,
        marginBottom: '15px'
    },
    cluesList: {
        listStyleType: 'none',
        padding: 0,
        margin: 0
    },
    clueItem: {
        marginBottom: '15px',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '10px'
    },
    clueHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '5px',
        fontSize: '18px'
    },
    revealBtn: {
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '16px',
        lineHeight: '1',
        paddingBottom: '2px'
    },
    hintText: {
        fontSize: '16px',
        fontFamily: 'monospace',
        backgroundColor: '#fff',
        padding: '4px 8px',
        borderRadius: '4px',
        border: '1px dashed #cbd5e1'
    }
};