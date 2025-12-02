import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import '../styles/Home.css'; 
import logo from '../assets/logo.svg'; 
import pediatriaImg from '../assets/imagens/pediatria.svg';
import telemedicinaImg from '../assets/imagens/telemedicina.svg';
import nutricaoImg from '../assets/imagens/nutricao.svg';

const Home = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isConsultaOpen, setIsConsultaOpen] = useState(false);
  const [consultaAtiva, setConsultaAtiva] = useState(null);

  const abrirConsulta = (tipo) => {
    setConsultaAtiva(tipo);
    setIsConsultaOpen(true);
  };

  const fecharConsulta = () => {
    setIsConsultaOpen(false);
    setConsultaAtiva(null);
  };

  const handleLogout = () => {
    // Limpa o token e volta pro login
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-top-logo">
          <img src={logo} alt="Logo BioClinic" className="main-logo" />
        </div>
        <div className="sidebar-user">Olá, Usuário!</div>
        <nav className="sidebar-nav">
          <ul>
            <li className="active">
                <Link to="/home" style={{textDecoration: 'none', color: 'inherit'}}>Inicio</Link>
            </li>
            <li>
                <Link to="/medicos" style={{textDecoration: 'none', color: 'inherit'}}>Médicos</Link>
            </li>
            <li>
                <Link to="/perfil" style={{textDecoration: 'none', color: 'inherit'}}>Meu Perfil</Link>
            </li>
             {/* Botão de Sair */}
            <li onClick={handleLogout} style={{cursor: 'pointer', marginTop: '20px', color: '#630527'}}>
                Sair
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="topbar">
          <span className="topbar-title">Inicio</span>
          <div className="topbar-searchbox-wrapper">
            <input type="text" placeholder="Buscar..." className="topbar-searchbox" />
            <svg className="svg-search" width="22" height="22" viewBox="0 0 22 22"><circle cx="10" cy="10" r="8" stroke="#21141c" strokeWidth="2" fill="white"/><line x1="16" y1="16" x2="21" y2="21" stroke="#21141c" strokeWidth="2"/></svg>
          </div>
          <div className="topbar-avatar">
             {/* Linkando o avatar para o Perfil também */}
            <Link to="/perfil">
                <svg width="28" height="28" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="#fff" stroke="#b992ac" strokeWidth="1.5"/><ellipse cx="12" cy="18" rx="7" ry="5" fill="#fff" stroke="#b992ac" strokeWidth="1.5"/></svg>
            </Link>
          </div>
        </header>
        
        <div className="consultas-header">
          <h2><b>Nossas especialidades</b></h2>
          <svg
            className="filter-svg"
            width="28"
            height="28"
            viewBox="0 0 28 28"
            onClick={() => setIsFilterOpen(true)}
          >
            <rect x="5" y="8" width="18" height="2" rx="1" fill="#24111a" />
            <rect x="8" y="13" width="12" height="2" rx="1" fill="#24111a" />
            <rect x="11" y="18" width="6" height="2" rx="1" fill="#24111a" />
          </svg>
        </div>

        {/* Cards de Especialidades */}
        <div className="consultas-cards">
          {/* Card 1 */}
          <div
            className="consulta-card pediatria"
            onClick={() => abrirConsulta('Pediatria')}
          >
            <img src={pediatriaImg} alt="Pediatria" />
            <span>Pediatria</span>
          </div>

          {/* Card 2 */}
          <div
            className="consulta-card pediatria"
            onClick={() => abrirConsulta('Dermatologia')}
          >
             <img src={pediatriaImg} alt="Pediatria" />
             <span>Dermatologia</span>
          </div>

          {/* Card 3 */}
          <div
            className="consulta-card telemedicina"
            onClick={() => abrirConsulta('Telemedicina')}
          >
            <img src={telemedicinaImg} alt="Telemedicina" />
            <span>Telemedicina (geral)</span>
          </div>

          {/* Card 4 */}
          <div
            className="consulta-card nutricao"
            onClick={() => abrirConsulta('Nutrição')}
          >
            <img src={nutricaoImg} alt="Nutrição" />
            <span>Nutrição</span>
          </div>
        </div>

        {isFilterOpen && (
          <div className="filter-modal-overlay" onClick={() => setIsFilterOpen(false)}>
            <div
              className="filter-modal-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="filter-modal-header">
                <button
                  type="button"
                  className="filter-modal-back"
                  onClick={() => setIsFilterOpen(false)}
                >
                  &#8592;
                </button>
              </div>

              <div className="filter-modal-options">
                <label className="filter-option">
                  <span>Comuns</span>
                  <input type="checkbox" />
                </label>
                <label className="filter-option">
                  <span>Online</span>
                  <input type="checkbox" />
                </label>
                <label className="filter-option">
                  <span>Bem-Estar</span>
                  <input type="checkbox" />
                </label>
                <label className="filter-option">
                  <span>Especializadas</span>
                  <input type="checkbox" />
                </label>
              </div>
            </div>
          </div>
        )}

        {isConsultaOpen && (
          <div className="consulta-modal-overlay" onClick={fecharConsulta}>
            <div
              className="consulta-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="consulta-modal-header">
                <button
                  type="button"
                  className="consulta-modal-back"
                  onClick={fecharConsulta}
                >
                  &#8592;
                </button>
              </div>

              <div className="consulta-modal-hero">
                {consultaAtiva === 'Pediatria' && (
                  <img src={pediatriaImg} alt="Pediatria" />
                )}
                {consultaAtiva === 'Dermatologia' && (
                  <img src={pediatriaImg} alt="Dermatologia" />
                )}
                {consultaAtiva === 'Telemedicina' && (
                  <img src={telemedicinaImg} alt="Telemedicina" />
                )}
                {consultaAtiva === 'Nutrição' && (
                  <img src={nutricaoImg} alt="Nutrição" />
                )}
                <div className="consulta-modal-hero-title">
                  {consultaAtiva}
                </div>
              </div>

              <div className="consulta-modal-body">
                <div className="consulta-section">
                  <h4>Benefícios:</h4>
                  <p>
                    A consulta de {consultaAtiva || 'saúde'} oferece cuidado
                    personalizado, acompanhamento contínuo e orientação para
                    prevenção de doenças e promoção de bem-estar.
                  </p>
                </div>

                <div className="consulta-section">
                  <h4>Tipo de consulta:</h4>
                  <p>Presencial</p>
                </div>

                <div className="consulta-section">
                  <h4>Duração:</h4>
                  <p>40min</p>
                </div>

                <div className="consulta-section consulta-preco">
                  <h4>Valor:</h4>
                  <p className="preco">R$ 150,00</p>
                </div>

                <button
                  type="button"
                  className="btn-agendar-consulta"
                  onClick={() => {
                    fecharConsulta();
                    navigate('/agendamento', { state: { nomeConsulta: consultaAtiva } });
                  }}
                >
                  Agendar
                </button>

                <p className="consulta-info-extra">
                  40 pessoas já fizeram essa consulta
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;