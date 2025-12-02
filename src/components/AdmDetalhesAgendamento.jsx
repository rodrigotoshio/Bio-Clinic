import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import logo from '../assets/logo.svg';
import medicaImg from '../assets/imagens/medica.svg';

const AdmDetalhesAgendamento = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Pega o agendamento do state
  const agendamento = location.state?.agendamento;
  
  if (!agendamento) {
    navigate('/adm-agendamentos');
    return null;
  }

  const nomeMes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  
  let dataFormatada = '';
  let horarioFormatado = '';
  
  if (agendamento.data) {
    const [ano, mesNum, dia] = agendamento.data.split('-').map(Number);
    const mesNome = nomeMes[mesNum - 1] || 'Fevereiro';
    dataFormatada = `${dia} de ${mesNome} de ${ano}`;
  }
  
  if (agendamento.horario) {
    horarioFormatado = agendamento.horario.replace(':', 'h');
  }

  const tipoConsulta = agendamento.tipo || 'Presencial';
  const nomeCliente = agendamento.nomeCliente || 'Nome Completo';
  const medico = agendamento.medico || { nome: 'Nome do medico', foto: medicaImg };
  const nomeConsulta = agendamento.nomeConsulta || 'Nome da consulta';

  return (
    <div className="adm-container">
      <aside className="adm-sidebar">
        <div className="adm-sidebar-title">Clínica</div>
        <nav className="adm-sidebar-nav">
          <ul>
            <li className="adm-nav-active">Informações Gerais</li>
            <li>Equipe Médica</li>
            <li>Serviços</li>
          </ul>
        </nav>
      </aside>

      <main className="adm-main">
        <div className="adm-header-top">
          <h1 className="adm-header-title">Detalhes do agendamento</h1>
        </div>
        <header className="adm-header">
          <div className="adm-header-left">
            <img src={logo} alt="BioClinic" className="adm-logo" />
            <span className="adm-logo-text">BioClinic</span>
          </div>
          <div className="adm-header-search">
            <input 
              type="text" 
              placeholder="nome da clinica" 
              className="adm-search-input" 
            />
            <svg className="adm-search-icon" width="20" height="20" viewBox="0 0 20 20">
              <circle cx="9" cy="9" r="7" stroke="#666" strokeWidth="2" fill="none"/>
              <line x1="14" y1="14" x2="18" y2="18" stroke="#666" strokeWidth="2"/>
            </svg>
          </div>
          <div className="adm-header-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" fill="#b992ac"/>
              <ellipse cx="12" cy="18" rx="7" ry="5" fill="#b992ac"/>
            </svg>
            <svg width="12" height="12" viewBox="0 0 12 12" style={{ marginLeft: 4 }}>
              <path d="M2 4 L6 8 L10 4" stroke="#b992ac" strokeWidth="2" fill="none"/>
            </svg>
          </div>
        </header>

        <div className="adm-content">
          <div className="adm-detalhes-wrapper">
            <div className="adm-detalhes-breadcrumb">nome da clinica</div>
            <h2 className="adm-detalhes-titulo">{nomeConsulta}</h2>

            <div className="adm-detalhes-bloco">
              <label className="adm-detalhes-label">Paciente</label>
              <div className="adm-detalhes-campo-grande">
                <div className="adm-detalhes-avatar">
                  <svg width="40" height="40" viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4" fill="#e6dde1"/>
                    <ellipse cx="12" cy="18" rx="7" ry="5" fill="#e6dde1"/>
                  </svg>
                </div>
                <span className="adm-detalhes-texto-campo">{nomeCliente}</span>
              </div>
            </div>

            <div className="adm-detalhes-bloco">
              <label className="adm-detalhes-label">Medico</label>
              <div className="adm-detalhes-campo-grande">
                <div className="adm-detalhes-avatar">
                  <img src={medico.foto || medicaImg} alt="Médico" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                </div>
                <span className="adm-detalhes-texto-campo">{medico.nome}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '12px', color: '#24111a' }}>●●●●●</span>
                  <span style={{ fontSize: '18px', color: '#24111a' }}>&#8250;</span>
                </div>
              </div>
            </div>

            <div className="adm-detalhes-bloco">
              <label className="adm-detalhes-label">Data e hora</label>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="adm-detalhes-campo-data">{dataFormatada}</div>
                <div className="adm-detalhes-campo-hora">{horarioFormatado}</div>
              </div>
            </div>

            <div className="adm-detalhes-bloco">
              <label className="adm-detalhes-label">tipo de consulta</label>
              <div className="adm-detalhes-campo-tipo">{tipoConsulta}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdmDetalhesAgendamento;

