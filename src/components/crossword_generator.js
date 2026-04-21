export  function generateCrosswordLayout(dictionary) {
    const MAX_GRID = 50; 
    const grid = Array(MAX_GRID).fill(null).map(() => Array(MAX_GRID).fill(""));
    const placedWords = [];

    const sortedDict = [...dictionary].sort((a, b) => b.niemiecki.length - a.niemiecki.length);

    const canPlaceWord = (word, startX, startY, isHoriz) => {
        // ZMIANA 1: Dwa słowa nigdy nie mogą zaczynać się w tej samej kratce
        if (placedWords.some(w => w.x === startX && w.y === startY)) {
            return false;
        }

        if (startX < 0 || startY < 0) return false;
        if (isHoriz && startX + word.length >= MAX_GRID) return false;
        if (!isHoriz && startY + word.length >= MAX_GRID) return false;

        let hasIntersection = false;

        if (isHoriz) {
            if (startX > 0 && grid[startY][startX - 1] !== "") return false;
            if (startX + word.length < MAX_GRID && grid[startY][startX + word.length] !== "") return false;
        } else {
            if (startY > 0 && grid[startY - 1][startX] !== "") return false;
            if (startY + word.length < MAX_GRID && grid[startY + word.length][startX] !== "") return false;
        }

        for (let i = 0; i < word.length; i++) {
            const x = isHoriz ? startX + i : startX;
            const y = isHoriz ? startY : startY + i;
            const cell = grid[y][x];

            if (cell === word[i]) {
                hasIntersection = true;
            } else if (cell !== "") {
                return false; 
            } else {
                if (isHoriz) {
                    if (y > 0 && grid[y - 1][x] !== "") return false;
                    if (y < MAX_GRID - 1 && grid[y + 1][x] !== "") return false;
                } else {
                    if (x > 0 && grid[y][x - 1] !== "") return false;
                    if (x < MAX_GRID - 1 && grid[y][x + 1] !== "") return false;
                }
            }
        }
        
        return placedWords.length === 0 ? true : hasIntersection;
    };

    const placeWord = (word, clue, startX, startY, isHoriz) => {
        for (let i = 0; i < word.length; i++) {
            const x = isHoriz ? startX + i : startX;
            const y = isHoriz ? startY : startY + i;
            grid[y][x] = word[i];
        }
        placedWords.push({ clue, x: startX, y: startY, word, isHoriz });
    };

    sortedDict.forEach((item) => {
        const word = item.niemiecki.toLowerCase();
        const clue = item.polski;
        let placed = false;

        if (placedWords.length === 0) {
            placeWord(word, clue, Math.floor(MAX_GRID / 2) - Math.floor(word.length / 2), Math.floor(MAX_GRID / 2), true);
            return;
        }

        for (let y = 0; y < MAX_GRID && !placed; y++) {
            for (let x = 0; x < MAX_GRID && !placed; x++) {
                if (grid[y][x] !== "") { 
                    for (let i = 0; i < word.length; i++) {
                        if (word[i] === grid[y][x]) {
                            if (canPlaceWord(word, x - i, y, true)) {
                                placeWord(word, clue, x - i, y, true);
                                placed = true; 
                                break;
                            }
                            if (canPlaceWord(word, x, y - i, false)) {
                                placeWord(word, clue, x, y - i, false);
                                placed = true; 
                                break;
                            }
                        }
                    }
                }
            }
        }
    });

    let minX = MAX_GRID, maxX = 0, minY = MAX_GRID, maxY = 0;
    
    for (let y = 0; y < MAX_GRID; y++) {
        for (let x = 0; x < MAX_GRID; x++) {
            if (grid[y][x] !== "") {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }

    if (maxX < minX || maxY < minY) return { table: [], words: [] };

    const finalTable = [];
    for (let y = minY; y <= maxY; y++) {
        finalTable.push(grid[y].slice(minX, maxX + 1));
    }

    // ZMIANA 2: Mapowanie tablicy końcowej, żeby zawierała klucz "direction"
    const finalWords = placedWords.map(w => ({
        direction: w.isHoriz ? "x" : "y",
        clue: w.clue,
        word: w.word,
        x: w.x - minX, 
        y: w.y - minY
    }));

    return { 
        table: finalTable, 
        words: finalWords 
    };
}