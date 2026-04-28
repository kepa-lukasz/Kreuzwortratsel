import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function ConfigScreen() {
    const [inputCount, setInputCount] = useState('10');
    const [inputSeed, setInputSeed] = useState('');
    const [inputDifficulty, setInputDifficulty] = useState('EASY');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams({
            count: inputCount,
            difficulty: inputDifficulty
        });
        if (inputSeed.trim()) params.set('seed', inputSeed.trim());
        navigate(`/crossword?${params.toString()}`);
    };

    return (
        <div style={styles.screenWrapper}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Nowa Gra</h1>
                    <p style={styles.subtitle}>Wybierz parametry i zacznij ćwiczyć.</p>
                </div>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Poziom trudności:</label>
                        <select value={inputDifficulty} onChange={(e) => setInputDifficulty(e.target.value)} style={styles.input}>
                            <option value="EASY">Łatwy</option>
                            <option value="MEDIUM">Średni</option>
                            <option value="HARD">Trudny</option>
                        </select>
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Ilość słów (1-30):</label>
                        <input type="number" min="1" max="30" value={inputCount} onChange={(e) => setInputCount(e.target.value)} style={styles.input} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Ziarno (Seed):</label>
                        <input type="text" placeholder="Opcjonalny kod..." value={inputSeed} onChange={(e) => setInputSeed(e.target.value)} style={styles.input} />
                    </div>
                    <button type="submit" style={styles.button}>Zacznij naukę 🚀</button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    appLayout: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #a4a5ff 0%, #8cb8ff 100%)',
        fontFamily: "'Segoe UI', Roboto, sans-serif",
    },
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 40px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
    },
    navLogo: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#1e293b',
        textDecoration: 'none'
    },
    navLinks: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center'
    },
    navLink: {
        textDecoration: 'none',
        color: '#64748b',
        fontWeight: '500',
        transition: 'color 0.2s'
    },
    loginBtn: {
        textDecoration: 'none',
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '8px 18px',
        borderRadius: '8px',
        fontWeight: '600',
        transition: 'transform 0.2s'
    },
    mainContent: {
        flex: 1, // To sprawia, że footer zawsze jest na dole
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
    },
    footer: {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        color: '#1e293b',
        fontSize: '14px'
    },
    screenWrapper: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
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
    header: { textAlign: 'center', marginBottom: '25px' },
    title: { margin: '0 0 10px 0', fontSize: '26px', color: '#0f172a', fontWeight: '800' },
    subtitle: { margin: '0', fontSize: '15px', color: '#64748b' },
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
    }
};