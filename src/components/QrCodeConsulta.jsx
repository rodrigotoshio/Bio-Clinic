import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const QrCodeConsulta = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Pega os dados da consulta do state ou do localStorage
  let consulta = location.state?.consulta;
  if (!consulta && typeof window !== 'undefined') {
    try {
      const consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
      consulta = consultas && consultas.length > 0 ? consultas[consultas.length - 1] : null;
    } catch {}
  }

  if (!consulta) {
    navigate('/consultas');
    return null;
  }

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="sidebar-user">Olá, Fulana!</div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/medicos" style={{ textDecoration: 'none', color: 'inherit' }}>
                Medicos
              </Link>
            </li>
            <li className="active">
              <Link to="/consultas" style={{ textDecoration: 'none', color: 'inherit' }}>
                Minhas consultas
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <span className="topbar-title">QR Code da consulta</span>
          <div className="topbar-searchbox-wrapper">
            <input type="text" placeholder="Buscar..." className="topbar-searchbox" />
          </div>
        </header>

        <div className="qrcode-wrapper">
          <div className="qrcode-breadcrumb">Aba/Agendamento/QRcode</div>
          
          <div className="qrcode-box">
            {/* Placeholder do QR Code - aqui depois pode ser gerado um QR code real */}
          </div>

          <div className="qrcode-instrucoes">
            <p className="qrcode-texto">
              Aponte o QRCode para o painel da recepção para identificarmos seu agendamento.
            </p>
            <p className="qrcode-atencao">
              ATENÇÃO: O QRCode só será valido no dia da consulta, com prazo de 30 minutos (tempo de espera, caso ocorra atraso)
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QrCodeConsulta;

