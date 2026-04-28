import React, { useRef, useState } from 'react';
import CluesPanel from './CluesPanel';

export default function CrosswordView({ table, words, onWin, onHint }) {
    const lastDirection = useRef(null);
    // Stan przechowujący tekst podpowiedzi wyświetlanej nad aktywnym polem
    const [activeClue, setActiveClue] = useState(null);

    const handleChange = (e, cell, direction, r, c) => {
        lastDirection.current = lastDirection.current || direction;
        
        // Jeśli litera jest błędna
        if (e.target.value.toLowerCase() !== cell.toLowerCase()) {
            e.target.style.color = '#e11d48'; // Czerwony dla błędu
            return;
        }

        // Jeśli litera jest poprawna
        e.target.disabled = true;
        e.target.style.color = '#15803d'; // Ciemnozielony
        e.target.style.backgroundColor = '#f0fdf4';

        // Sprawdzanie wygranej
        const totalInputs = document.querySelectorAll('input').length;
        const disabledInputs = document.querySelectorAll('input:disabled').length;
        if (totalInputs > 0 && totalInputs === disabledInputs) {
            if (onWin) onWin();
        }

        // Logika automatycznego przeskakiwania do następnego pola
        const tryMove = (dir) => {
            let nextR = r;
            let nextC = c;
            while (true) {
                if (dir === "across") nextC++;
                else if (dir === "down") nextR++;
                
                const nextInput = document.getElementById(`input${nextR}-${nextC}`);
                if (!nextInput) return false;
                
                if (!nextInput.disabled) {
                    nextInput.focus();
                    lastDirection.current = dir;
                    return true;
                }
                // Jeśli pole jest już wypełnione (disabled), szukamy dalej w tej samej linii
                if (dir === "across" && nextC >= table[0].length) return false;
                if (dir === "down" && nextR >= table.length) return false;
            }
        };

        let moved = tryMove(lastDirection.current);
        if (!moved) {
            const fallbackDir = direction || (lastDirection.current === "across" ? "down" : "across");
            tryMove(fallbackDir);
        }
    };

    const handleFocus = (startingWord) => {
        if (startingWord) {
            setActiveClue(startingWord.polish);
        }
    };

    const handleKeyDown = (e, r, c) => {
        switch (e.key) {
            case "ArrowUp": e.preventDefault(); document.getElementById(`input${r - 1}-${c}`)?.focus(); break;
            case "ArrowDown": e.preventDefault(); document.getElementById(`input${r + 1}-${c}`)?.focus(); break;
            case "ArrowLeft": e.preventDefault(); document.getElementById(`input${r}-${c - 1}`)?.focus(); break;
            case "ArrowRight": e.preventDefault(); document.getElementById(`input${r}-${c + 1}`)?.focus(); break;
            case "Backspace": 
                if (e.target.value === "" && !e.target.disabled) {
                    // Opcjonalna logika powrotu przy backspace
                }
                break;
            default: break;
        }
    };

    if (!table || table.length === 0) return null;

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                
                {/* LEWA KOLUMNA: PLANSZA */}
                <div style={styles.boardSection}>
                    <h2 style={styles.heading}>Rozwiąż krzyżówkę</h2>
                    
                    <div style={{
                        ...styles.gridContainer,
                        gridTemplateColumns: `repeat(${table[0].length}, 38px)`
                    }}>
                        {table.map((row, r) =>
                            row.map((cell, c) => {
                                const isCellEmpty = !cell; 
                                const startingWord = words.find(w => (w.startx - 1) === c && (w.starty - 1) === r);
                                
                                return (
                                    <div key={`${r}-${c}`} style={styles.cellWrapper}>
                                        {!isCellEmpty ? (
                                            <>
                                                {/* Tooltip wyświetlany tylko nad pierwszą literą danego słowa */}
                                                {startingWord && activeClue === startingWord.polish && (
                                                    <div style={styles.clueTooltip}>
                                                        {activeClue}
                                                        <div style={styles.tooltipArrow} />
                                                    </div>
                                                )}

                                                {startingWord && (
                                                    <span style={styles.cellNumber}>
                                                        {startingWord.position}
                                                    </span>
                                                )}
                                                
                                                <input
                                                    autoComplete="off"
                                                    spellCheck="false"
                                                    id={`input${r}-${c}`}
                                                    type="text"
                                                    maxLength="1"
                                                    onFocus={() => handleFocus(startingWord)}
                                                    onBlur={() => setActiveClue(null)}
                                                    onClick={() => {
                                                        if (startingWord?.orientation) {
                                                            lastDirection.current = startingWord.orientation;
                                                        }
                                                    }}
                                                    onChange={(e) => handleChange(e, cell, startingWord?.orientation, r, c)}
                                                    onKeyDown={(e) => handleKeyDown(e, r, c)}
                                                    style={styles.input}
                                                />
                                            </>
                                        ) : (
                                            <div style={styles.emptyBlock} />
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                
                <div style={styles.cluesWrapper}>
                    <CluesPanel words={words} onHint={onHint}/>
                </div>

            </div>
        </div>
    );
}

const styles = {
    container: {
        width: '100%',
        padding: '20px 0'
    },
    wrapper: {
        display: 'flex',
        gap: '40px',
        alignItems: 'flex-start',
        flexWrap: 'wrap'
    },
    boardSection: {
        flex: '1',
        minWidth: 'max-content'
    },
    heading: {
        fontSize: '20px',
        color: '#1e293b',
        marginBottom: '20px',
        fontWeight: '700'
    },
    gridContainer: {
        display: 'grid',
        gap: '4px',
        background: "linear-gradient(135deg, #a4a5ff 0%, #8cb8ff 100%)",
        padding: '10px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        width: 'max-content'
    },
    cellWrapper: {
        position: 'relative',
        width: '38px',
        height: '38px',
    },
    input: {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        fontSize: '18px',
        fontWeight: 'bold',
        border: '1.5px solid #cbd5e1',
        borderRadius: '6px',
        outline: 'none',
        backgroundColor: '#ffffff',
        textTransform: 'uppercase',
        transition: 'all 0.15s ease',
        cursor: 'text'
    },
    cellNumber: {
        position: 'absolute',
        top: '2px',
        left: '4px',
        fontSize: '10px',
        fontWeight: '800',
        color: '#64748b',
        zIndex: 5,
        pointerEvents: 'none'
    },
    emptyBlock: {
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent'
    },
    cluesWrapper: {
        flex: '0 0 300px'
    },
    // STYLE TOOLTIPA (CLUE)
    clueTooltip: {
        position: 'absolute',
        bottom: '125%', 
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#1e293b',
        color: '#ffffff',
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
        zIndex: 100,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
        pointerEvents: 'none',
        // Animacja fadeIn (zdefiniowana w CSS)
        animation: 'tooltipIn 0.2s ease-out'
    },
    tooltipArrow: {
        position: 'absolute',
        top: '100%',
        left: '50%',
        marginLeft: '-6px',
        borderWidth: '6px',
        borderStyle: 'solid',
        borderColor: '#1e293b transparent transparent transparent'
    }
};

