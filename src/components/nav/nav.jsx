import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCurrentUser, logout } from '../../API'; // Importujemy nasze funkcje
import { IoPersonCircle } from "react-icons/io5";
import { GoGear } from "react-icons/go";
import { TbLogout2 } from "react-icons/tb";
import { MdHistory } from "react-icons/md";


export const Navbar = () => {
    // 1. Stan użytkownika - na początku nie wiemy, czy ktoś jest zalogowany
    const [user, setUser] = useState({ logged: false });
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // 2. SPRAWDZANIE STATUSU: Wywoływane raz przy wejściu na stronę
    useEffect(() => {
        const checkAuth = async () => {
            const userData = await fetchCurrentUser();
            setUser(userData);
        };
        checkAuth();
    }, []);

    // Zamykanie menu po kliknięciu poza nim
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
            <Link to="/" style={styles.navLogo}>🇩🇪 Lern Deutsch</Link>

            <div style={styles.navLinks}>
                <Link to="/" style={styles.navLink}>Ucz się</Link>
                <Link to="/rankings" style={styles.navLink}>Wyzwanie rankingowe</Link>
                <Link to="/ranking" style={styles.navLink}>Sala chwały</Link>

                {/* 3. LOGIKA WYŚWIETLANIA NA BAZIE STANU */}
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
                                <Link to="/rankings/hitstory" style={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
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
        alignItems: "center", /* Centrowanie w pionie */
        gap: "3px"            /* Odstęp między SVG a tekstem */
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
    navLogo: { fontSize: '22px', fontWeight: 'bold', color: '#1e293b', textDecoration: 'none' },
    navLinks: { display: 'flex', gap: '20px', alignItems: 'center' },
    navLink: { textDecoration: 'none', color: '#64748b', fontWeight: '500' },
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
    smallAvatar: { width: '24px', height: '24px', borderRadius: '50%' },

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