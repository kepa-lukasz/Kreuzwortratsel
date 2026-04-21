// src/utils/wordSelector.js
import seedrandom from 'seedrandom';
import dictionary from '../data/data.json';

export function getWordsFromJson(count = 10, seed = null) {
    const rng = seed ? seedrandom(seed) : Math.random;
    
    const totalWords = dictionary.length;

    const selectedIndices = new Set();

    while (selectedIndices.size < count) {
        const randomIndex = Math.floor(rng() * totalWords);
        selectedIndices.add(randomIndex);
    }

    return Array.from(selectedIndices).map(index => dictionary[index]);
   
}