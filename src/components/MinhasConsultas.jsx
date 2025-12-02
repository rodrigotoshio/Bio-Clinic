import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function getDiaSemanaPorData(dataString) {
  // dataString no formato '2024-02-12' (ano, mês, dia)
  const diasPt = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  if (!dataString) return '';
  const [ano, mes, dia] = dataString.split('-').map(Number);
  const d = new Date(ano, mes - 1, dia);
  return diasPt[d.getDay()];
}

const MinhasConsultas = () => {
  const navigate = useNavigate();
  let consultasSalvas = [];
  try {
    consultasSalvas = JSON.parse(localStorage.getItem('consultas')) || [];
  } catch {}
  consultasSalvas = consultasSalvas.reverse(); // mais novas primeiro
  const temConsultas = consultasSalvas && consultasSalvas.length > 0;

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
            <li className="active">Minhas consultas</li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <span className="topbar-title">Minhas Consultas</span>
          <div className="topbar-searchbox-wrapper">
            <input
              type="text"
              placeholder="Buscar consulta..."
              className="topbar-searchbox"
            />
          </div>
        </header>
        <div className="minhasconsultas-list">
          {temConsultas ? (
            consultasSalvas.map((c, idx) => {
            const nomeMes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
            const dia = c.data ? (c.data.split('-')[2] || '15') : '15';
            const mesNum = c.data ? parseInt(c.data.split('-')[1] || '2', 10) : 2;
            const mesNome = nomeMes[mesNum - 1] || 'Fevereiro';
            // Dia da semana calculado
            const diaSemana = c.data ? getDiaSemanaPorData(c.data) : '';
            const nome = c.nomeConsulta || c.medico?.nome || c.nome || 'Nome da consulta';
            const foto = c.medico?.foto || c.foto;
            const dataFormatada = c.data ? `${dia} de ${mesNome}` : '';
            const horario = c.horario || '';
            
            return (
              <div
                key={idx}
                className="minhasconsultas-card"
                onClick={() => navigate('/consulta-detalhe', { state: { consulta: c } })}
              >
                <div className="minhasconsultas-card-left" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e6dde1', minHeight: 95 }}>
                  {foto && (
                    <img src={foto} alt="médico" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} />
                  )}
                </div>
                <div className="minhasconsultas-card-main">
                  <div className="minhasconsultas-card-title">{nome}</div>
                  <div className="minhasconsultas-card-sub">
                    {dataFormatada}{' '}
                    <span className="minhasconsultas-badge">{diaSemana}</span>
                    {horario && (
                      <span style={{ marginLeft: 8, fontSize: '12px', color: '#fff', background: '#caadc3',padding:'2px 8px',borderRadius: '10px' }}>
                        {horario}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
              <p style={{ fontSize: '18px', marginBottom: '8px' }}>Nenhuma consulta agendada</p>
              <p style={{ fontSize: '14px' }}>Agende uma consulta com um de nossos médicos</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MinhasConsultas;


