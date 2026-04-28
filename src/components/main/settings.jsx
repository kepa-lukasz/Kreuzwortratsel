import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { fetchCurrentUser, updateUsername, deleteAccount } from '../../API';

export default function SettingsScreen() {
    const [user, setUser] = useState(null);
    const [newName, setNewName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCurrentUser().then(data => {
            if (data.logged) {
                setUser(data);
                setNewName(data.name);
            } else {
                navigate('/login');
            }
        });
    }, [navigate]);

    const handleUpdateName = async (e) => {
        e.preventDefault();
        try {
            await updateUsername(newName);
            Swal.fire('Sukces!', 'Nazwa użytkownika została zmieniona.', 'success')
            .then(() =>  window.location.reload()); 
        } catch (err) {
            Swal.fire('Błąd', "Spróbuj inną nazwę, lub skontaktuj się z administratorem", 'error');
        }
    };

    const handleDeleteAccount = () => {
        Swal.fire({
            title: 'Czy na pewno?',
            text: "Twoja historia gier i punkty zostaną bezpowrotnie usunięte!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Tak, usuń konto',
            cancelButtonText: 'Anuluj'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteAccount();
                    Swal.fire('Usunięto!', 'Twoje konto przestało istnieć.', 'success')
                        .then(() =>  window.location.reload()); // Twardy reset na stronę główną
                } catch (err) {
                    Swal.fire('Błąd', 'Nie udało się usunąć konta.', 'error');
                }
            }
        });
    };

    if (!user) return null;

    return (
        <div style={styles.screenWrapper}>
            <div style={styles.card}>
                <h1 style={styles.title}>Ustawienia Profilu </h1>
                <div style={styles.formContainer}>

                    <form onSubmit={handleUpdateName} style={styles.settingsForm}>
                        <label style={styles.label}>Twoja nazwa użytkownika</label>
                        <div style={styles.inputWrapper}>
                            <div style={styles.inputIcon}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <input
                                style={styles.modernInput}
                                value={newName}
                                placeholder="Wpisz nowy nick..."
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <button type="submit" style={styles.saveButton}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                Zapisz
                            </button>
                        </div>
                    </form>
                </div>

                <div style={styles.divider} />

                <div style={styles.dangerZone}>
                    <h3 style={{ color: '#ef4444', marginTop: 0 }}>Strefa Niebezpieczna</h3>
                    <p style={{ fontSize: '14px', color: '#64748b' }}>Usunięcie konta jest nieodwracalne.</p>
                    <button onClick={handleDeleteAccount} style={styles.deleteBtn}>
                        Usuń konto trwale
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    settingsForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%',
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        gap: '12px', // odstęp między inputem a przyciskiem
    },
    inputIcon: {
        position: 'absolute',
        left: '12px',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
    },
    modernInput: {
        flex: 1,
        padding: '12px 12px 12px 40px', // większy lewy padding na ikonkę
        fontSize: '16px',
        borderRadius: '12px',
        border: '2px solid #e2e8f0',
        backgroundColor: '#f8fafc',
        transition: 'all 0.2s ease',
        outline: 'none',
        color: '#1e293b',
    },
    saveButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px 20px',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontWeight: 'bold',
        fontSize: '15px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
        whiteSpace: 'nowrap', // zapobiega łamaniu tekstu w przycisku
    },
    label: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginLeft: '4px'
    },
    // ... użyj swoich stałych screenWrapper, card, input, button ...
    divider: { height: '2px', backgroundColor: '#f1f5f9', margin: '30px 0' },
    formContainer: {
        padding: '20px',
        border: '2px solid #acc5ff',
        borderRadius: '12px',
        backgroundColor: '#e8eefc'
    },
    dangerZone: {
        padding: '20px',
        border: '2px solid #fee2e2',
        borderRadius: '12px',
        backgroundColor: '#fffafb'
    },
    deleteBtn: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontWeight: 'bold',
        cursor: 'pointer'
    }
    // (reszta Twoich stylów z poprzednich komponentów)
};