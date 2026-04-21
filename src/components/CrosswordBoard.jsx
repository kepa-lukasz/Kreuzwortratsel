import React, { useRef } from 'react';
import { generateCrosswordLayout } from './crossword_generator';
import CluesPanel from './CluesPanel';



export default function CrosswordView({table, words}) {
    const lastDirection = useRef("x");
    
   const handleChange = (e, cell, direction = lastDirection.current, r, c) => {
   
    if (e.target.value !== cell) return;
    e.target.style.color = (e.target.value === cell) ? '#15803d' : '#000';
    lastDirection.current = direction;
    let nextR = r;
    let nextC = c;

    while (true) {
        if (direction === "x") {
            nextC++;
        } else if (direction === "y") {
            nextR++;
        } //szukamy następnego inputa
        const nextInput = document.getElementById(`input${nextR}-${nextC}`);
        if (!nextInput) {
            break; // jeśli nie istnieje żaden input, to trafiliśmy na koniec i break 
        }
        const correctLetter = table[nextR][nextC];

        if (nextInput.value !== correctLetter) {
            nextInput.focus(); //jeśli input nie jest prawidłowo wypełniony, to go focusujemy
            break;            
        }
    }
}
    const handleKeyDown = (e, r, c) => {
        switch (e.key) {
            case "ArrowUp":    // Góra
                e.preventDefault(); // Zapobiega przewijaniu strony
                document.getElementById(`input${r - 1}-${c}`)?.focus();
                break;
            case "ArrowDown":  // Dół
                e.preventDefault();
                document.getElementById(`input${r + 1}-${c}`)?.focus();
                break;
            case "ArrowLeft":  // Lewo
                e.preventDefault();
                document.getElementById(`input${r}-${c - 1}`)?.focus();
                break;
            case "ArrowRight": // Prawo
                e.preventDefault();
                document.getElementById(`input${r}-${c + 1}`)?.focus();
                
                break;
            default:
                // Ignorujemy wszystkie inne klawisze (litery, backspace itp.),
                // żeby nie blokować wpisywania tekstu.
                break;
        }
    };

    return (
        <div style={styles.container}>
            {/* SEKCJA PLANSZY */}
            <div>
                <h2 style={styles.heading}>Rozwiąż krzyżówkę</h2>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${table[0].length}, 40px)`,
                        gap: '2px',
                        backgroundColor: '#333',
                        padding: '4px',
                        borderRadius: '4px',
                        width: 'fit-content'
                    }}
                >
                    {table.map((row, r) =>
                        row.map((cell, c) => {

                            const isCellEmpty = cell === "";
                            const startingWord = words.find(w => w.x === c && w.y === r);
                            return (
                                <div key={`${r}-${c}`} style={styles.cellWrapper}>
                                    {!isCellEmpty ? (
                                        <>
                                            {words.indexOf(startingWord) !== -1 && (
                                                <span style={styles.cellNumber}>
                                                    {words.indexOf(startingWord)}
                                                </span>
                                            )}
                                            <input
                                                id={`input${r}-${c}`}
                                                type="text"
                                                onChange={(e) => (handleChange(e, cell, (startingWord?.direction), r, c))}
                                                onKeyDown={(e) => handleKeyDown(e, r, c)}
                                                style={{
                                                    ...styles.input,
                                                }}
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
           
           <CluesPanel words={words}/>

            
        </div>
    );
}

// Proste style wpisane w obiekt, żebyś nie musiał od razu konfigurować CSSów
const styles = {
    container: {
        display: 'flex',
        gap: '50px',
        padding: '20px',
        fontFamily: 'sans-serif',
        alignItems: 'flex-start'
    },
    heading: {
        marginTop: 0,
        marginBottom: '15px'
    },
    cellWrapper: {
        position: 'relative',
        width: '40px',
        height: '40px',
    },
    input: {
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        textAlign: 'center',
        fontSize: '20px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        border: 'none',
        outline: 'none',
    },
    emptyBlock: {
        width: '100%',
        height: '100%',
        backgroundColor: '#333'
    },
    cellNumber: {
        position: 'absolute',
        top: '2px',
        left: '2px',
        fontSize: '10px',
        fontWeight: 'bold',
        color: '#666',
        zIndex: 2,
        pointerEvents: 'none'
    },
    cluesContainer: {
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        minWidth: '200px'
    },
    cluesList: {
        listStyleType: 'none',
        padding: 0,
        margin: 0
    },
    clueItem: {
        marginBottom: '10px',
        fontSize: '18px'
    }
};