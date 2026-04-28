
export const fetchCrossword = async (count, seed, difficulty) => {
    // 1. Budujemy parametry zapytania
    const params = new URLSearchParams({
        count: count
    });
    
    // Jeśli seed istnieje, dodajemy go do parametrów
    if (seed) {
        params.append('seed', seed);
    }
    if (difficulty) {
        params.append('difficulty', difficulty);
    }
    // 2. Wykonujemy zapytanie
    const url = `${process.env.REACT_APP_API_URL}/GetCrossWords?${params.toString()}`
    
    
    const response = await fetch(url);
    
    // 3. Sprawdzamy, czy odpowiedź serwera jest poprawna (kody 200-299)
    if (!response.ok) {
        throw new Error(`Błąd serwera HTTP: ${response.status}`);
    }

    // 4. Wyciągamy JSON
    const data = await response.json();

    
    // 5. Walidacja danych zwrotnych
if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Algorytm nie zdołał ułożyć słówek na planszy.");
    }

    // Zwracamy czysty obiekt (seed i słówka)
    return data;
};