// src/components/MainCrossword.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getWordsFromJson } from './words_selector';
import { generateCrosswordLayout } from './crossword_generator';
import CrosswordView from './CrosswordBoard';
import { useNavigate } from 'react-router-dom';

export default function MainCrossword() {
    
    const [searchParams] = useSearchParams();
    const navigate = useNavigate(); // Do powrotu na stronę główną
    const [crosswordData, setCrosswordData] = useState(null);

    useEffect(() => {
        const seedParam = searchParams.get('seed');
        const countParam = searchParams.get('count');

        const parsedCount = countParam ? parseInt(countParam, 10) : 10;
        const safeCount = Math.min(Math.max(parsedCount, 1), 30);

        const selectedWords = getWordsFromJson(safeCount, seedParam);
        const generated = generateCrosswordLayout(selectedWords);
        
        setCrosswordData({ 
            table: generated.table, 
            words: generated.words, 
            usedSeed: seedParam,
            requestedCount: safeCount
        });

    }, [searchParams]);

    if (!crosswordData) {
        return <div>Trwa generowanie krzyżówki...</div>;
    }

    if (crosswordData.table.length === 0) {
        return (
            <div>
                <p style={{ color: 'red' }}>Nie udało się ułożyć krzyżówki. Spróbuj innych ustawień.</p>
                <button onClick={() => navigate('/')}>Wróć do ustawień</button>
            </div>
        );
    }
    return (
        <div> 
            <CrosswordView 
                table={crosswordData.table} 
                words={crosswordData.words}
            />
        </div>
    );
}