import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import logo from '../assets/logo.svg';

function getDiaSemanaPorData(dataString) {
  const diasPt = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  if (!dataString) return '';
  const [ano, mes, dia] = dataString.split('-').map(Number);
  const d = new Date(ano, mes - 1, dia);
  return diasPt[d.getDay()];
}

const AdmAgendamentos = () => {
  const navigate = useNavigate();
  
  // Busca todas as consultas agendadas
  let agendamentos = [];
  try {
    agendamentos = JSON.parse(localStorage.getItem('consultas') || '[]');
  } catch {}
  
  // Ordena por data (mais recentes primeiro)
  agendamentos = agendamentos.reverse();
  
  const nomeMes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

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
          <div className="adm-agendamentos-list">
            {agendamentos.length > 0 ? (
              agendamentos.map((agendamento, idx) => {
                const dia = agendamento.data ? (agendamento.data.split('-')[2] || '15') : '15';
                const mesNum = agendamento.data ? parseInt(agendamento.data.split('-')[1] || '9', 10) : 9;
                const mesNome = nomeMes[mesNum - 1] || 'Setembro';
                const diaSemana = agendamento.data ? getDiaSemanaPorData(agendamento.data) : 'Seg';
                const nomeCliente = agendamento.nomeCliente || 'Nome do Cliente';
                const nomeConsulta = agendamento.nomeConsulta || 'Nome da consulta';
                const dataFormatada = agendamento.data ? `${dia} de ${mesNome}` : '15 de Setembro';

                return (
                  <div 
                    key={idx} 
                    className="adm-agendamento-card"
                    onClick={() => navigate('/adm-detalhes-agendamento', { state: { agendamento } })}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="adm-card-left-cut"></div>
                    <div className="adm-card-content">
                      <div className="adm-card-nome-cliente">{nomeCliente}</div>
                      <div className="adm-card-nome-consulta">{nomeConsulta}</div>
                      <div className="adm-card-right">
                        <span className="adm-card-data">{dataFormatada}</span>
                        <span className="adm-card-dia-badge">{diaSemana}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
                <p style={{ fontSize: '18px' }}>Nenhum agendamento encontrado</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdmAgendamentos;

