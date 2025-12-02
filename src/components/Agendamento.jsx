import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import medicaImg from '../assets/imagens/medica.svg';

const medicos = [
  {
    id: 1,
    nome: 'Dra. Marina Oliveira',
    foto: medicaImg,
  },
  // outros médicos depois
];
const diasMes = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const nomeMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const horarios = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
const tiposConsulta = ['Presencial', 'Online'];

// Função para gerar os dias do calendário de um mês específico
function gerarCalendario(ano, mes) {
  const primeiroDia = new Date(ano, mes - 1, 1);
  const ultimoDia = new Date(ano, mes, 0);
  const diasNoMes = ultimoDia.getDate();
  const diaSemanaInicio = primeiroDia.getDay(); // 0 = Domingo, 1 = Segunda, etc.
  
  const semanas = [];
  let semanaAtual = [];
  
  // Preenche os dias do mês anterior (se necessário)
  const mesAnterior = mes === 1 ? 12 : mes - 1;
  const anoAnterior = mes === 1 ? ano - 1 : ano;
  const ultimoDiaMesAnterior = new Date(anoAnterior, mesAnterior, 0).getDate();
  
  for (let i = diaSemanaInicio - 1; i >= 0; i--) {
    semanaAtual.push(ultimoDiaMesAnterior - i);
  }
  
  // Preenche os dias do mês atual
  for (let dia = 1; dia <= diasNoMes; dia++) {
    semanaAtual.push(dia);
    if (semanaAtual.length === 7) {
      semanas.push([...semanaAtual]);
      semanaAtual = [];
    }
  }
  
  // Preenche os primeiros dias do próximo mês (se necessário)
  let diaProximoMes = 1;
  while (semanaAtual.length < 7 && semanaAtual.length > 0) {
    semanaAtual.push(diaProximoMes);
    diaProximoMes++;
  }
  
  if (semanaAtual.length > 0) {
    semanas.push(semanaAtual);
  }
  
  return semanas;
}

function getDiaSemanaPorData(dataString) {
  // dataString no formato '2024-02-12' (ano, mês, dia)
  const diasPt = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  if (!dataString) return '';
  const [ano, mes, dia] = dataString.split('-').map(Number);
  const d = new Date(ano, mes - 1, dia);
  return diasPt[d.getDay()];
}

const Agendamento = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Pega o nome da consulta do state (especialidade escolhida na Home)
  const nomeConsultaFromState = location.state?.nomeConsulta || '';
  const [medicoSel, setMedicoSel] = useState(medicos[0].id);
  const [anoAtual, setAnoAtual] = useState(2024);
  const [mesAtual, setMesAtual] = useState(2); // Fevereiro
  const [diaSel, setDiaSel] = useState(8); // Default: 8 de Fevereiro
  const [horaSel, setHoraSel] = useState('08:00');
  const [tipoSel, setTipoSel] = useState(tiposConsulta[0]);

  const diasCalendario = gerarCalendario(anoAtual, mesAtual);

  const mesAnterior = () => {
    if (mesAtual === 1) {
      setMesAtual(12);
      setAnoAtual(anoAtual - 1);
    } else {
      setMesAtual(mesAtual - 1);
    }
    setDiaSel(null); // Limpa seleção ao mudar mês
  };

  const mesProximo = () => {
    if (mesAtual === 12) {
      setMesAtual(1);
      setAnoAtual(anoAtual + 1);
    } else {
      setMesAtual(mesAtual + 1);
    }
    setDiaSel(null); // Limpa seleção ao mudar mês
  };

  // Gera o objeto da consulta real
  const handleFinalizar = () => {
    if (!diaSel) {
      alert('Por favor, selecione um dia');
      return;
    }
    const medico = medicos.find((m) => m.id === medicoSel);
    const dia = diaSel;
    const dataISO = `${anoAtual}-${String(mesAtual).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    // Pega o nome do cliente (pode vir do sistema de autenticação depois)
    const nomeCliente = typeof window !== 'undefined' 
      ? (localStorage.getItem('nomeUsuario') || 'Fulana') 
      : 'Fulana';
    
    const consulta = {
      nomeCliente,
      nomeConsulta: nomeConsultaFromState || `Consulta com ${medico.nome}`,
      medico,
      data: dataISO,
      horario: horaSel,
      tipo: tipoSel,
    };
    // Salva em localStorage antes de navegar
    let consultas = [];
    try {
      consultas = JSON.parse(localStorage.getItem('consultas') || '[]');
    } catch {}
    consultas.push(consulta);
    localStorage.setItem('consultas', JSON.stringify(consultas));
    // Navega para tela de confirmação com os dados
    navigate('/confirmacao', { state: { consulta } });
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="sidebar-user">Olá, Fulana!</div>
        <nav className="sidebar-nav">
          <ul>
            <li><Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>Inicio</Link></li>
            <li><Link to="/medicos" style={{ textDecoration: 'none', color: 'inherit' }}>Medicos</Link></li>
            <li className="active"><Link to="/consultas" style={{ textDecoration: 'none', color: 'inherit' }}>Minhas consultas</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <span className="topbar-title">Agendamento</span>
          <div className="topbar-searchbox-wrapper">
            <input type="text" placeholder="Buscar..." className="topbar-searchbox" />
          </div>
        </header>
        <div className="agendamento-wrapper-agenda">
          <div className="agendamento-titulo">{nomeConsultaFromState || 'Nome da consulta'}</div>
          <div className="agendamento-linha-flex">
            {/* Médicos disponíveis */}
            <div className="agendamento-mediso-col agendamento-bloco">
              <div className="agendamento-subtitulo">Medicos disponíveis</div>
              <div className="agendamento-medicos-lista">
                {medicos.map((medico) => (
                  <div
                    key={medico.id}
                    className={`agendamento-medico-card${medicoSel === medico.id ? ' agendamento-medico-card-sel' : ''}`}
                    onClick={() => setMedicoSel(medico.id)}
                  >
                    <img src={medico.foto} alt="foto" className="agendamento-medico-foto" />
                    <span className="agendamento-medico-nome">{medico.nome}</span>
                    <span className="agendamento-seta">&#8250;</span>
                  </div>
                ))}
              </div>
              <div className="agendamento-subtitulo" style={{ marginTop: 24 }}>Horários disponíveis</div>
              <div className="agendamento-horarios-grid">
                {horarios.map((h, i) => (
                  <div
                    key={h + '-' + i}
                    className={`agendamento-horario-btn${horaSel === h ? ' agendamento-horario-btn-sel' : ''}`}
                    onClick={() => setHoraSel(h)}
                  >
                    {h}
                  </div>
                ))}
              </div>
            </div>
            {/* Dias / tipo de consulta */}
            <div className="agendamento-diascol agendamento-bloco">
              <div className="agendamento-subtitulo">Dias disponíveis</div>
              <div className="agendamento-calendario-box">
                <div className="agendamento-calendario-top">
                  <span style={{ fontWeight: 'bold', cursor:'pointer' }} onClick={mesAnterior}>&#8249;</span> <span>{nomeMeses[mesAtual - 1]}</span> <span style={{ fontWeight: 'bold', cursor:'pointer' }} onClick={mesProximo}>&#8250;</span>
                </div>
                <div className="agendamento-calendario">
                  <div className="agendamento-cabeca-semana">
                    {diasMes.map((d, i) => (<div key={i}>{d}</div>))}
                  </div>
                  {diasCalendario.map((semana, idx) => (
                    <div className="agendamento-semana" key={idx}>
                      {semana.map((d, j) => {
                        // Verifica se o dia pertence ao mês atual
                        const primeiroDiaMes = new Date(anoAtual, mesAtual - 1, 1).getDate();
                        const ultimoDiaMes = new Date(anoAtual, mesAtual, 0).getDate();
                        const primeiroDiaSemana = semana[0];
                        const ultimoDiaSemana = semana[semana.length - 1];
                        
                        // Se está na primeira semana e o dia é maior que 20, é do mês anterior
                        // Se está na última semana e o dia é menor que 7, é do próximo mês
                        const isDiaValido = !((idx === 0 && d > 20) || (idx === diasCalendario.length - 1 && d < 7));
                        
                        return (
                          <div
                            key={j}
                            className={`agendamento-dia${diaSel === d && isDiaValido ? ' agendamento-dia-sel' : ''}${!isDiaValido ? ' agendamento-dia-outro-mes' : ''}`}
                            onClick={() => isDiaValido && setDiaSel(d)}
                            style={{ opacity: isDiaValido ? 1 : 0.4, cursor: isDiaValido ? 'pointer' : 'default' }}
                          >
                            {d}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              <div className="agendamento-subtitulo" style={{ marginTop: 18 }}>Tipo de consulta</div>
              <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                {tiposConsulta.map(tipo => (
                  <button
                    key={tipo}
                    type="button"
                    className={`agendamento-tipo-btn${tipoSel === tipo ? ' agendamento-tipo-btn-sel' : ''}`}
                    onClick={() => setTipoSel(tipo)}
                  >
                    {tipo}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
            <button
              className="agendamento-finalizar-btn"
              onClick={handleFinalizar}
            >
              Finalizar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Agendamento;
