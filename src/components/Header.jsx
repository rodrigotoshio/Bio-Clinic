import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css'; 

// Importação das Imagens
import LogoBioClinic from '../assets/imagens/logo-nome-lateral.svg';
// Caminho do ícone de perfil
const IconePerfil = "src/assets/imagens/perfil.svg"; 

function Header() {
    const [dropdownAberto, setDropdownAberto] = useState(false);
    
    // --- ESTADOS PARA O MODO DE EDIÇÃO ---
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        nome: "Dra. Leyla",
        idade: "34",
        sexo: "Feminino"
    });
    const [tempData, setTempData] = useState(userData);

    const toggleDropdown = () => {
        setDropdownAberto(!dropdownAberto);
        // Se fechar o menu, sai do modo edição para resetar visualização
        if(dropdownAberto) setIsEditing(false); 
    };

    // Entrar no modo edição
    const handleEditClick = () => {
        setTempData(userData); // Carrega dados atuais para edição
        setIsEditing(true);
    };

    // Salvar
    const handleSave = () => {
        setUserData(tempData); // Salva o estado temporário no oficial
        setIsEditing(false);
    };

    // Cancelar
    const handleCancel = () => {
        setIsEditing(false); // Apenas fecha o modo edição
    };

    // Atualizar inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTempData({ ...tempData, [name]: value });
    };

    // Ações Extras
    const handleRefazerBiometria = () => alert("Iniciando nova captura biométrica...");
    const handleAtualizarLocal = () => alert("Atualizando localização GPS...");

    return (
        <header className="main-header">
            
            <div className="header-left">
                <div className="header-logo">
                    <img src={LogoBioClinic} alt="Logo BioClinic" className="logo-img" />
                </div>
                <div className="header-search">
                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                    <input type="text" placeholder="Pesquisar" className="search-input" />
                </div>
            </div>

            <div className="header-profile-container">
                <div className="profile-trigger" onClick={toggleDropdown}>
                    <div className="profile-avatar">
                        <img src={IconePerfil} alt="Perfil" className="profile-icon-img" />
                    </div>
                    <i className={`fa-solid fa-chevron-down dropdown-arrow ${dropdownAberto ? 'open' : ''}`}></i>
                </div>

                {dropdownAberto && (
                    <div className="profile-dropdown-menu">
                        
                        {/* --- CARTÃO DE INFORMAÇÕES DO USUÁRIO --- */}
                        <div className="dropdown-user-info">
                            
                            {/* Avatar fixo no topo */}
                            <div className="dropdown-user-avatar">
                                <img src={IconePerfil} alt="Perfil" />
                            </div>

                            {/* CONDICIONAL: MODO VISUALIZAÇÃO vs MODO EDIÇÃO */}
                            {!isEditing ? (
                                <>
                                    {/* Botão de Lápis para Editar */}
                                    <button className="btn-edit-user" title="Editar Dados" onClick={handleEditClick}>
                                        <i className="fa-solid fa-pen"></i>
                                    </button>

                                    <p className="user-name"><strong>{userData.nome}</strong></p>
                                    <p className="user-detail">{userData.idade} anos</p>
                                    <p className="user-detail">{userData.sexo}</p>
                                    
                                    <div className="user-status-row">
                                        <span className="status-tag bio">Biometria</span>
                                        <span className="status-tag loc">Localização</span>
                                    </div>
                                </>
                            ) : (
                                /* --- CAIXA DE EDIÇÃO --- */
                                <div className="edit-mode-container">
                                    <input 
                                        type="text" name="nome" className="user-edit-input" 
                                        value={tempData.nome} onChange={handleChange} placeholder="Nome"
                                    />
                                    <div className="edit-row">
                                        <input 
                                            type="text" name="idade" className="user-edit-input small" 
                                            value={tempData.idade} onChange={handleChange} placeholder="Idade"
                                        />
                                        <select 
                                            name="sexo" className="user-edit-input small"
                                            value={tempData.sexo} onChange={handleChange}
                                        >
                                            <option value="Feminino">Feminino</option>
                                            <option value="Masculino">Masculino</option>
                                        </select>
                                    </div>

                                    {/* Botões Extras: Biometria e Local */}
                                    <div className="edit-extra-options">
                                        <button className="btn-extra-action" onClick={handleRefazerBiometria}>
                                            <i className="fa-solid fa-fingerprint"></i> Refazer Biometria
                                        </button>
                                        <button className="btn-extra-action" onClick={handleAtualizarLocal}>
                                            <i className="fa-solid fa-location-dot"></i> Atualizar Local
                                        </button>
                                    </div>

                                    {/* Ações: Salvar / Cancelar */}
                                    <div className="edit-actions">
                                        <button className="btn-save" onClick={handleSave}>Salvar</button>
                                        <button className="btn-cancel" onClick={handleCancel}>X</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="dropdown-divider"></div>

                        {/* Links de Navegação */}
                        <Link to="/perfil" className="dropdown-item">
                            <i className="fa-regular fa-user"></i> Meu Perfil
                        </Link>
                        <Link to="/configuracoes" className="dropdown-item">
                            <i className="fa-solid fa-gear"></i> Configurações
                        </Link>
                        <div className="dropdown-divider"></div>
                        <Link to="/login" className="dropdown-item logout-item">
                            <i className="fa-solid fa-arrow-right-from-bracket"></i> Sair
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;