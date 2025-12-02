import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import medicaImg from '../assets/imagens/medica.svg';
import qrCodeImg from '../assets/imagens/Qr Code.svg';

const ConsultaDetalhe = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const consultaState = location.state && location.state.consulta;
  const medicoState = location.state && location.state.medico;

  // Tenta pegar a consulta do state, senão tenta pegar do localStorage
  let consulta = consultaState;
  if (!consulta && typeof window !== 'undefined') {
    try {
      const consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
      consulta = consultas && consultas.length > 0 ? consultas[consultas.length - 1] : null;
    } catch {}
  }

  const medico = consulta?.medico || medicoState || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('medicoSelecionado') || 'null') : null) || {
    nome: 'Nome do Médico',
  };

  // Formata a data
  const nomeMes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  let dataFormatada = '15 de Setembro';
  let anoFormatado = '2014';
  let horarioFormatado = '14h00';
  
  if (consulta && consulta.data) {
    const [ano, mesNum, dia] = consulta.data.split('-').map(Number);
    const mesNome = nomeMes[mesNum - 1] || 'Setembro';
    dataFormatada = `${dia} de ${mesNome}`;
    anoFormatado = String(ano);
  }
  
  if (consulta && consulta.horario) {
    horarioFormatado = consulta.horario.replace(':', 'h');
  }

  const tipoConsulta = consulta?.tipo || 'Presencial';

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
              <Link
                to="/consultas"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                Minhas consultas
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <span className="topbar-title">Minhas consultas / Agendamento</span>
          <div className="topbar-searchbox-wrapper">
            <input
              type="text"
              placeholder="Buscar..."
              className="topbar-searchbox"
            />
          </div>
          <button 
            type="button" 
            className="consultadet-qrcode-btn"
            onClick={() => {
              const consulta = location.state?.consulta;
              if (!consulta && typeof window !== 'undefined') {
                try {
                  const consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
                  if (consultas && consultas.length > 0) {
                    navigate('/qrcode-consulta', { state: { consulta: consultas[consultas.length - 1] } });
                    return;
                  }
                } catch {}
              }
              navigate('/qrcode-consulta', { state: { consulta } });
            }}
          >
            <img src={qrCodeImg} alt="QRCode" style={{ width: 30, height: 28, verticalAlign: 'middle', marginRight: 4 }} />
            QRCode
          </button>
        </header>

        <div className="consultadet-container">
          <h2 className="consultadet-titulo">{consulta?.nomeConsulta || 'Nome da Consulta'}</h2>

          <section className="consultadet-medico-card">
            <div className="consultadet-medico-left">
              <img src={medico.foto || medicaImg} alt="Médico" className="consultadet-medico-foto" />
            </div>
            <div className="consultadet-medico-main">
              <div className="consultadet-medico-nome">
                {medico.nome || 'Nome do Médico'}
              </div>
            </div>
          </section>

          <section className="consultadet-bloco">
            <h4>Data e hora</h4>
            <p>
              <span className="consultadet-link">{dataFormatada}</span> de {anoFormatado} às{' '}
              <span className="consultadet-link">{horarioFormatado}</span>
            </p>
          </section>

          <section className="consultadet-bloco">
            <h4>Tipo de consulta</h4>
            <p>{tipoConsulta}</p>
          </section>

          <section className="consultadet-bloco">
            <h4>Benefícios</h4>
            <p>
              A consulta com o clínico geral traz vários benefícios: ela permite uma
              avaliação completa da saúde, identificando sintomas iniciais de doenças
              antes que se agravem. Além disso, o clínico pode orientar sobre hábitos
              saudáveis, prescrever exames preventivos e encaminhar o paciente para
              especialistas quando necessário. É uma forma prática e segura de manter
              o acompanhamento médico regular.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ConsultaDetalhe;


