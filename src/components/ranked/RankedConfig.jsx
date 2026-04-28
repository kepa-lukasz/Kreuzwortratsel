import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchCurrentUser } from "../../API"; // Upewnij się, że masz to w api.js

export default function RankingConfigScreen() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [inputDifficulty, setInputDifficulty] = useState('MEDIUM');
    const navigate = useNavigate();

    // Sprawdzanie czy użytkownik jest zalogowany
    useEffect(() => {
        fetchCurrentUser()
            .then(data => {

                setUser(data);
                setLoading(false);
            })
            .catch(() => {
                setUser(null);
                setLoading(false);
            });
    }, []);

    const handleLoginRedirect = () => {
        // Przekazujemy aktualną ścieżkę w obiekcie state
        navigate('/login', { state: { from: window.location.pathname } });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // W trybie rankingowym zazwyczaj używamy tylko trudności, 
        // bo COUNT i SEED są narzucone przez serwer dla sprawiedliwości.
        const params = new URLSearchParams({
            difficulty: inputDifficulty
        });
        navigate(`/ranked/game?${params.toString()}`);
    };

    if (loading) {
        return <div style={styles.screenWrapper}><p style={styles.subtitle}>Weryfikacja profilu...</p></div>;
    }

    // WIDOK: Jeśli nie ma użytkownika (Brama logowania)
    if (!user.logged) {
        return (
            <div style={styles.screenWrapper}>
                <div style={styles.card}>
                    <div style={styles.header}>
                        <h1 style={styles.title}>🔒 Tryb Rankingowy</h1>
                        <p style={styles.subtitle}>Musisz być zalogowany, aby zdobywać punkty i walczyć o miejsce w rankingu.</p>
                    </div>
                    <div style={styles.form}>
                        <button
                            onClick={() => navigate('/login')}
                            style={styles.button}
                        >
                            Zaloguj się 🔑
                        </button>
                        <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
                            Nie masz konta? <span onClick={() => navigate('/register')} style={styles.link}>Zarejestruj się</span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // WIDOK: Jeśli użytkownik jest zalogowany (Konfiguracja)
    return (
        <div style={styles.screenWrapper}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Arena Rankingowa</h1>
                    <p style={styles.subtitle}>Witaj, {user.username}! Gotowy na wyzwanie?</p>
                </div>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Wybierz poziom trudności:</label>
                        <select
                            value={inputDifficulty}
                            onChange={(e) => setInputDifficulty(e.target.value)}
                            style={styles.input}
                        >
                            <option value="EASY">Łatwy (1 litera - 1 punkt)</option>
                            <option value="MEDIUM">Średni (1 litera - 2 punkty)</option>
                            <option value="HARD">Trudny (1 litera - 3 punkty)</option>
                        </select>
                    </div>

                    <div style={styles.infoBox}>
                        <p style={{ margin: 0, fontSize: '13px', color: '#1e293b' }}>
                            ℹ️ W trybie rankingowym parametry są dobierane automatycznie, aby zapewnić równe szanse wszystkim graczom.
                        </p>
                    </div>

                    <button type="submit" style={styles.button}>Rozpocznij grę o punkty 🏆</button>
                </form>
            </div>
        </div>
    );
}

// Style - rozszerzone o kilka drobiazgów (link, infoBox)
const styles = {
    screenWrapper: { width: '100%', display: 'flex', justifyContent: 'center', padding: '20px' },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        padding: '35px',
        boxSizing: 'border-box'
    },
    header: { textAlign: 'center', marginBottom: '25px' },
    title: { margin: '0 0 10px 0', fontSize: '26px', color: '#0f172a', fontWeight: '800' },
    subtitle: { margin: '0', fontSize: '15px', color: '#64748b', lineHeight: '1.4' },
    form: { display: 'flex', flexDirection: 'column', gap: '18px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontWeight: '600', fontSize: '13px', color: '#475569' },
    input: {
        padding: '12px',
        fontSize: '16px',
        borderRadius: '10px',
        border: '2px solid #e2e8f0',
        backgroundColor: '#f8fafc',
        outline: 'none'
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
    link: { color: '#2563eb', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' },
    infoBox: {
        padding: '12px',
        backgroundColor: '#eff6ff',
        borderRadius: '10px',
        border: '1px solid #bfdbfe',
    }
};