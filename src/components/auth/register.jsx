import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../API';

export const RegisterScreen = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        // Walidacja haseł po stronie frontendu
        if (formData.password !== formData.confirmPassword) {
            setError('Hasła nie są identyczne!');
            return;
        }

        try {
            await register(formData.username, formData.email, formData.password);
            setSuccess(true);
            // Po 2 sekundach przekieruj do logowania
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    if (success) {
        return (
            <div style={styles.screenWrapper}>
                <div style={styles.card}>
                    <h2 style={{...styles.title, color: '#10b981'}}>Sukces! 🎉</h2>
                    <p style={{textAlign: 'center', color: '#64748b'}}>
                        Konto zostało utworzone. Zaraz zostaniesz przekierowany do logowania...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.screenWrapper}>
            <div style={styles.card}>
                <h2 style={styles.title}>Stwórz konto</h2>
                <p style={{textAlign: 'center', color: '#64748b', marginBottom: '20px'}}>Dołącz do społeczności Lern Deutsch!</p>

                {error && <div style={{color: '#ef4444', textAlign: 'center', marginBottom: '15px', fontWeight: 'bold'}}>{error}</div>}

                <form style={styles.form} onSubmit={handleRegister}>
                    <input 
                        name="username"
                        type="text" 
                        placeholder="Nazwa użytkownika" 
                        style={styles.input} 
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <input 
                        name="email"
                        type="email" 
                        placeholder="Adres e-mail" 
                        style={styles.input} 
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input 
                        name="password"
                        type="password" 
                        placeholder="Hasło" 
                        style={styles.input} 
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <input 
                        name="confirmPassword"
                        type="password" 
                        placeholder="Powtórz hasło" 
                        style={styles.input} 
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    
                    <button type="submit" style={styles.button}>Zarejestruj się ✨</button>
                </form>

                <p style={{textAlign: 'center', fontSize: '14px', color: '#64748b', marginTop: '20px'}}>
                    Masz już konto? <span onClick={() => navigate('/login')} style={{color: '#2563eb', cursor: 'pointer', fontWeight: 'bold'}}>Zaloguj się</span>
                </p>
            </div>
        </div>
    );
};

// Style skopiowane z Twojego LoginScreen dla zachowania spójności
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
    title: { margin: '0 0 10px 0', fontSize: '26px', color: '#0f172a', fontWeight: '800', textAlign: 'center' },
    form: { display: 'flex', flexDirection: 'column', gap: '18px' },
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
    }
};