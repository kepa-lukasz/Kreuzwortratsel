// src/components/ChooseUsernameScreen.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUsername, fetchCurrentUser } from '../../API'; // dostosuj ścieżkę

export const ChooseUsernameScreen = () => {
    const [username, setLocalUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const navigate = useNavigate();

    // Zabezpieczenie: jeśli user już ma username, przekieruj dalej
    useEffect(() => {
        const check = async () => {
            try {
                const user = await fetchCurrentUser();
                if (!user.logged) {
                    navigate('/login');
                } else if (user.profileComplete) {
                    navigate('/home');
                }
            } catch {
                navigate('/login');
            } finally {
                setChecking(false);
            }
        };
        check();
    }, [navigate]);

    const handleSubmit = async () => {

        const trimmed = username.trim();
        console.log('trimmed:', trimmed);

        try {
            const result = await setUsername(trimmed);
            console.log('result:', result);
            window.location.replace('/home');
        } catch (err) {
            console.log('błąd:', err);
            setError(err.message);
        }
    };

    if (checking) {
        return (
            <div style={styles.screenWrapper}>
                <p style={{ color: '#64748b' }}>Ładowanie...</p>
            </div>
        );
    }

    return (
        <div style={styles.screenWrapper}>
            <div style={styles.card}>

                {/* Emoji + nagłówek */}
                <div style={{ textAlign: 'center', marginBottom: '8px', fontSize: '40px' }}>🎓</div>
                <h2 style={styles.title}>Jak mamy się do Ciebie zwracać?</h2>
                <p style={styles.subtitle}>
                    Wybierz nazwę, która będzie widoczna w rankingach i grach.
                </p>

                {/* Błąd */}
                {error && (
                    <div style={styles.errorBox}>{error}</div>
                )}



                <div style={styles.form}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Twoja nazwa użytkownika"
                            style={styles.input}
                            value={username}
                            onChange={(e) => { setLocalUsername(e.target.value); setError(''); }}
                            maxLength={30}
                            autoFocus
                        />
                        <span style={styles.charCount}>{username.trim().length}/30</span>
                    </div>

                    <p style={styles.hint}>Od 3 do 30 znaków.</p>

                    <button
                        type="button"           // ← nie submit, żadnego odświeżania
                        onClick={handleSubmit}  // ← onClick zamiast onSubmit
                        style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
                        disabled={loading}
                    >
                        {loading ? 'Zapisywanie...' : 'Gotowe, zaczynajmy! 🚀'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    screenWrapper: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        padding: '35px',
        boxSizing: 'border-box',
    },
    title: {
        margin: '0 0 8px 0',
        fontSize: '24px',
        color: '#0f172a',
        fontWeight: '800',
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        color: '#64748b',
        fontSize: '14px',
        marginBottom: '24px',
        lineHeight: '1.5',
    },
    errorBox: {
        color: '#ef4444',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        padding: '10px 14px',
        marginBottom: '16px',
        fontSize: '14px',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    input: {
        padding: '12px',
        paddingRight: '52px', // miejsce na licznik
        fontSize: '16px',
        borderRadius: '10px',
        border: '2px solid #e2e8f0',
        backgroundColor: '#f8fafc',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
    },
    charCount: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '12px',
        color: '#94a3b8',
        pointerEvents: 'none',
    },
    hint: {
        fontSize: '12px',
        color: '#94a3b8',
        margin: '0',
        textAlign: 'center',
    },
    button: {
        padding: '14px',
        fontSize: '17px',
        fontWeight: 'bold',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        transition: 'background 0.2s',
        marginTop: '4px',
    },
};