import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCurrentUser, logout } from '../../API';
import { IoPersonCircle } from "react-icons/io5";
import { GoGear } from "react-icons/go";
import { TbLogout2 } from "react-icons/tb";
import { MdHistory } from "react-icons/md";

export const Navbar = () => {
    const [user, setUser] = useState({ logged: false });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const checkAuth = async () => {
            const userData = await fetchCurrentUser();
            setUser(userData);
        };
        checkAuth();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav style={styles.navbar}>
            <Link to="/" style={styles.navLogo}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 300 200" style={styles.flagIcon}>
                    <rect width="300" height="200" fill="#FFCE00"/>
                    <rect width="300" height="133.3" fill="#DD0000"/>
                    <rect width="300" height="66.6" fill="#000000"/>
                </svg>
                Lern Deutsch
            </Link>

            <div style={styles.navLinks}>
                <Link to="/" style={styles.navLink}>Krzyżówki</Link>
                
                {/* Zaktualizowane linki z badge'em na górze */}
                <div style={styles.disabledLink}>
                    <span style={styles.badge}>Wkrótce</span>
                    Wykreślanki
                </div>
                <div style={styles.disabledLink}>
                    <span style={styles.badge}>Wkrótce</span>
                    Fiszki
                </div>

                <Link to="/ranking" style={styles.navLink}>Sala chwały</Link>

                {!user.logged ? (
                    <Link to="/login" style={styles.authButton}>Zaloguj się</Link>
                ) : (
                    <div style={styles.profileContainer} ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            style={styles.authButton}
                        >
                            <div style={styles.defaultAvatar}>
                                <IoPersonCircle size={30} />
                            </div>
                            <span style={styles.userNameButton}>
                                {user.name || 'Użytkownik'}
                            </span>
                        </button>

                        {isMenuOpen && (
                            <div style={styles.dropdownMenu}>
                                <div style={styles.dropdownHeader}>
                                    <div style={styles.dropdownName}>{user.name}</div>
                                    <div style={styles.dropdownEmail}>{user.email}</div>
                                    <div style={styles.dropdownPoints}>🏆 Punkty: {user.points || 0}</div>
                                </div>
                                <hr style={styles.dropdownDivider} />
                                <Link to="/settings" style={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
                                    <span style={styles.span}>
                                        <GoGear /> Ustawienia
                                    </span>
                                </Link>
                                <Link to="/history" style={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
                                    <span style={styles.span}>
                                        <MdHistory /> Historia
                                    </span>
                                </Link>
                                <button
                                    onClick={() => logout()}
                                    style={{ ...styles.dropdownItem, color: '#ef4444', fontWeight: 'bold', background: 'none', border: 'none', width: '100%' }}
                                >
                                    <span style={styles.span}>
                                        <TbLogout2 /> Wyloguj się
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

const styles = {
    span: {
        display: "flex",
        alignItems: "center",
        gap: "6px" 
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
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px', 
        fontSize: '22px', 
        fontWeight: 'bold', 
        color: '#1e293b', 
        textDecoration: 'none' 
    },
    flagIcon: {
        borderRadius: '3px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
    },
    navLinks: { display: 'flex', gap: '24px', alignItems: 'center' }, // Lekko zwiększyłem gap, żeby zachować oddech
    navLink: { textDecoration: 'none', color: '#64748b', fontWeight: '500' },
    
    // Zmiany tutaj:
    disabledLink: { 
        position: 'relative', // Kluczowe dla pozycjonowania badge'a
        display: 'flex', 
        justifyContent: 'center',
        color: '#cbd5e1', 
        fontWeight: '500', 
        cursor: 'not-allowed',
        userSelect: 'none'
    },
    badge: {
        position: 'absolute',
        top: '-14px', // Przesunięcie do góry
        left: '50%', // Centrowanie na środku tekstu
        transform: 'translateX(-50%)', 
        backgroundColor: '#e2e8f0', // Lekko przyciemnione tło
        color: '#64748b',
        fontSize: '9px', // Mniejszy, dyskretniejszy font
        padding: '2px 6px',
        borderRadius: '10px',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        whiteSpace: 'nowrap' // Zapobiega załamywaniu napisu
    },
    
    authButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 18px',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none'
    },
    profileContainer: { position: 'relative' },
    defaultAvatar: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
    userNameButton: { marginLeft: '4px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    dropdownMenu: {
        position: 'absolute',
        top: 'calc(100% + 10px)',
        right: '0',
        width: '200px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0',
        zIndex: 1000,
        overflow: 'hidden'
    },
    dropdownHeader: { padding: '15px', backgroundColor: '#f8fafc' },
    dropdownName: { fontWeight: 'bold', fontSize: '14px' },
    dropdownEmail: { fontSize: '12px', color: '#64748b' },
    dropdownPoints: { fontSize: '13px', color: '#d97706', marginTop: '5px', fontWeight: 'bold' },
    dropdownDivider: { margin: '0', borderTop: '1px solid #e2e8f0' },
    dropdownItem: {
        padding: '12px 15px',
        textDecoration: 'none',
        color: '#334155',
        display: 'block',
        fontSize: '14px',
        cursor: 'pointer',
        textAlign: 'left'
    }
};