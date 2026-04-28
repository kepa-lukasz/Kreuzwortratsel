// src/components/LoginScreen.js (lub tam gdzie go trzymasz)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, loginWithGoogle } from '../../API'; // Dostosuj ścieżkę do pliku api.js
import { FcGoogle } from "react-icons/fc";
import { fetchCurrentUser } from '../../API';


export const LoginScreen = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [checkingAuth, setCheckingAuth] = useState(true);
    const navigate = useNavigate();
   
    const handleLogin = async (e) => {
        e.preventDefault(); // Zatrzymuje domyślne przeładowanie strony formularza
        setError('');

        try {


            await login(username, password);


            window.location.replace('/home');

        } catch (err) {
            // Jeśli w api.js wyrzuci błąd 401, wpadniemy tutaj
            console.error("Błąd logowania:", err.message);
            setError(err.message);
        }
    };

    return (
        <div style={styles.screenWrapper}>
            <div style={styles.card}>
                <h2 style={styles.title}>Witaj ponownie!</h2>

                {/* Wyświetlanie błędu logowania */}
                {error && <div style={{ color: '#ef4444', textAlign: 'center', marginBottom: '15px', fontWeight: 'bold' }}>{error}</div>}

                <form style={styles.form} onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Email lub login"
                        style={styles.input}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Hasło"
                        style={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" style={styles.button}>Zaloguj się 🔑</button>

                    {/* <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', margin: '0' }}>
                        Zapomniałeś hasła? <span style={{ color: '#2563eb', cursor: 'pointer' }}>Przywróć hasło</span>
                    </p> */}
                </form>

                <div style={styles.divider}>lub</div>

                <button onClick={loginWithGoogle} style={styles.googleButton}>
                    <FcGoogle />
                    Zaloguj przez Google
                </button>

                <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', marginTop: '20px' }}>
                    Nie masz konta? <span onClick={() => navigate('/register')} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 'bold' }}>Zarejestruj się</span>
                </p>
            </div>
        </div>
    );
};

// Zaktualizowane style z dodanymi brakującymi elementami (Google Button, Divider)
const styles = {
    screenWrapper: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '20px'
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        padding: '35px',
        boxSizing: 'border-box'
    },
    title: {
        margin: '0 0 20px 0',
        fontSize: '26px',
        color: '#0f172a',
        fontWeight: '800',
        textAlign: 'center'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
    },
    input: {
        padding: '12px',
        fontSize: '16px',
        borderRadius: '10px',
        border: '2px solid #e2e8f0',
        backgroundColor: '#f8fafc',
        outline: 'none',
        transition: 'border-color 0.2s'
    },
    button: {
        padding: '14px',
        fontSize: '17px',
        fontWeight: 'bold',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'background 0.2s'
    },
    divider: {
        textAlign: 'center',
        margin: '20px 0',
        color: '#94a3b8',
        fontSize: '14px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    googleButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '12px',
        fontSize: '16px',
        fontWeight: 'bold',
        backgroundColor: '#ffffff',
        color: '#334155',
        border: '2px solid #e2e8f0',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'background 0.2s',
        width: '100%'
    }
};