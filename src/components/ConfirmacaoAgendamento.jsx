import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import medicaImg from '../assets/imagens/medica.svg';

const ConfirmacaoAgendamento = () => {
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
    // Se não tiver dados, volta para agendamento
    navigate('/agendamento');
    return null;
  }

  const medico = consulta.medico || { nome: 'Nome do médico', foto: medicaImg };
  const nomeMes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  
  let dataFormatada = '';
  let horarioFormatado = '';
  
  if (consulta.data) {
    const [ano, mesNum, dia] = consulta.data.split('-').map(Number);
    const mesNome = nomeMes[mesNum - 1] || 'Fevereiro';
    dataFormatada = `${dia} de ${mesNome} de ${ano}`;
  }
  
  if (consulta.horario) {
    horarioFormatado = consulta.horario.replace(':', 'h');
  }

  const tipoConsulta = consulta.tipo || 'Presencial';

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
          <span className="topbar-title">Confirmação do agendamento</span>
          <div className="topbar-searchbox-wrapper">
            <input type="text" placeholder="Buscar..." className="topbar-searchbox" />
          </div>
        </header>

        <div className="confirmacao-wrapper">
          <div className="confirmacao-breadcrumb">aba/Agendamento/confirmação</div>
          <h2 className="confirmacao-titulo">{consulta.nomeConsulta || 'Nome da consulta'}</h2>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
            <button 
              type="button" 
              className="confirmacao-qrcode-btn"
              onClick={() => navigate('/qrcode-consulta', { state: { consulta } })}
            >
              Gerar QRCode
            </button>
          </div>

          <div className="confirmacao-bloco">
            <h4 className="confirmacao-label">Medico</h4>
            <div className="confirmacao-medico-card">
              <div className="confirmacao-medico-avatar">
                <img src={medico.foto || medicaImg} alt="Médico" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              </div>
              <span className="confirmacao-medico-nome">{medico.nome}</span>
              <span className="confirmacao-seta">&#8250;</span>
            </div>
          </div>

          <div className="confirmacao-bloco">
            <h4 className="confirmacao-label">Data e hora</h4>
            <div className="confirmacao-campo">{dataFormatada}</div>
            <div className="confirmacao-campo">{horarioFormatado}</div>
          </div>

          <div className="confirmacao-bloco">
            <h4 className="confirmacao-label">Tipo de consulta</h4>
            <div className="confirmacao-campo">{tipoConsulta}</div>
          </div>

          <div className="confirmacao-bloco">
            <h4 className="confirmacao-label">Beneficios</h4>
            <p className="confirmacao-beneficios-texto">
              A consulta com o clínico geral traz vários benefícios: ela permite uma avaliação completa da saúde, identificando sintomas iniciais de doenças antes que se agravem. Além disso, o clínico pode orientar sobre hábitos saudáveis, prescrever exames preventivos e encaminhar o paciente para especialistas quando necessário. É uma forma prática e segura de manter o acompanhamento médico regular.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConfirmacaoAgendamento;

