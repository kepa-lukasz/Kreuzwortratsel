
export const buildTableFromWords = (words) => {
    if (!words || !Array.isArray(words) || words.length === 0) {
        return [];
    }
    
    let maxX = 0;
    let maxY = 0;

    // 1. Obliczamy całkowite wymiary planszy (szukamy najbardziej wysuniętych liter)
    words.forEach(w => {
        const endX = w.orientation === 'across' ? w.startx + w.answer.length - 1 : w.startx;
        const endY = w.orientation === 'down' ? w.starty + w.answer.length - 1 : w.starty;
        
        if (endX > maxX) maxX = endX;
        if (endY > maxY) maxY = endY;
    });

    // 2. Inicjalizujemy dwuwymiarową tablicę wypełnioną wartością null
    const table = Array(maxY).fill(null).map(() => Array(maxX).fill(null));

    // 3. Wypełniamy planszę literami
    words.forEach(w => {
        const wordUpper = w.answer.toUpperCase();
        
        for (let i = 0; i < wordUpper.length; i++) {
            // Przesuwamy indeksy o -1 (z backendowego 1-based na javascriptowe 0-based)
            const x = w.orientation === 'across' ? w.startx - 1 + i : w.startx - 1;
            const y = w.orientation === 'down' ? w.starty - 1 + i : w.starty - 1;
            
            table[y][x] = wordUpper[i];
        }
    });

    return table;
};