// src/api.js
const API_URL = process.env.REACT_APP_API_URL

export const login = async (username, password) => {
    // Spring Security domyślnie oczekuje danych formularza, a nie JSONa
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        credentials: 'include' // Kluczowe do zapisania ciasteczka sesji w przeglądarce!
    });
    
    if (!response.ok) {
        throw new Error('Nieprawidłowy login lub hasło.');
    }
    return response;
};

export const register = async (username, email, password) => {
    const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include'
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Wystąpił błąd podczas rejestracji.');
    }
    return response.json();
};

export const logout = () => {
    // Przekierowanie na backend to najpewniejszy sposób na ubicie sesji w Springu
    window.location.href = `${API_URL}/logout`;
};

export const loginWithGoogle = () => {
    window.location.href = `${API_URL}/oauth2/authorization/google`;
};

export const fetchCurrentUser = async () => {
    try {
        const response = await fetch(`${API_URL}/api/user/me`, {
            method: 'GET',
            credentials: 'include', // Wysyła ciasteczko sesji
        });
        if (!response.ok) return { logged: false };
        return await response.json();
    } catch (err) {
        return { logged: false };
    }
};
export const fetchRanking = async () => {
    const response = await fetch(`${API_URL}/api/ranking`);
    if (!response.ok) {
        throw new Error('Nie udało się pobrać rankingu.');
    }
    return response.json();
};
export const getRankingCrossword = async (difficulty = 'EASY') => {
    const response = await fetch(`${API_URL}/ranking/GetCrossWords?difficulty=${difficulty}`, {
        credentials: 'include'
    });
    if (response.status === 401) throw new Error('UNAUTHORIZED');
    if (!response.ok) throw new Error('Błąd pobierania krzyżówki');
    return response.json();
};

export const finishRankingGame = async (gameId, hints, surrender = false) => {
    const response = await fetch(`${API_URL}/ranking/FinishGame?surrender=${surrender}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            gameId: Number(gameId),
            hints: hints,
        }),
        credentials: 'include'
    });

    
    return response.json();
};
export const getMyHistory = async () => {
    const response = await fetch('${API_URL}/ranking/MyHistory', {
        method: 'GET',
        credentials: 'include',
    });

    if (response.status === 401) throw new Error('UNAUTHORIZED');
    if (!response.ok) throw new Error('Błąd podczas pobierania historii');
    
    return response.json();
};
export const updateUsername = async (newUsername) => {
    const url = `${API_URL}/update-username?newUsername=${encodeURIComponent(newUsername)}`
  
    
    const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include'
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
};

export const deleteAccount = async () => {
    const response = await fetch(`${API_URL}/delete-account`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!response.ok) throw new Error('Błąd podczas usuwania konta');
    return response.json();
};