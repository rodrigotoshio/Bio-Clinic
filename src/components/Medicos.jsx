import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import medicaImg from '../assets/imagens/medica.svg';

const Medicos = () => {
  const [medicoSelecionado, setMedicoSelecionado] = useState(null);
  const navigate = useNavigate();

  const medicos = [
    {
      id: 1,
      nome: 'Dra. Marina Oliveira',
      idade: '38 anos',
      formacao: 'Medicina pela USP',
      especialidade: 'Pediatria',
      crm: '123456-SP',
      tempoAtuacao: '12 anos',
      horario: 'Segunda a sexta, das 8h às 17h',
      atendimentos: '1.237 atendimentos',
    },
    // Se quiser mais médicos, pode adicionar aqui
  ];

  const abrirModal = (medico) => {
    setMedicoSelecionado(medico);
  };

  const fecharModal = () => {
    setMedicoSelecionado(null);
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="sidebar-user">Olá, Fulana!</div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
                Início
              </Link>
            </li>
            <li className="active">Medicos</li>
            <li>
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
          <span className="topbar-title">Médicos</span>
          <div className="topbar-searchbox-wrapper">
            <input
              type="text"
              placeholder="Buscar médico..."
              className="topbar-searchbox"
            />
          </div>
        </header>

        <div style={{ padding: '16px 8px' }}>
          {medicos.map((medico) => (
            <div
              key={medico.id}
              className="medico-card"
              onClick={() => abrirModal(medico)}
            >
              <div className="medico-card-left">
                <div className="medico-avatar">
                  <img src={medicaImg} alt="Médica" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                </div>
                <span>{medico.nome}</span>
              </div>
              <span className="medico-card-arrow">{'>'}</span>
            </div>
          ))}
        </div>

        {medicoSelecionado && (
          <div className="medico-modal-overlay" onClick={fecharModal}>
            <div
              className="medico-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="medico-modal-top">
                <img src={medicaImg} alt="Médica" className="medico-modal-foto" />

                <div className="medico-modal-top-info">
                  <h3>{medicoSelecionado.nome}</h3>
                  <p className="medico-modal-linha">{medicoSelecionado.idade}</p>
                  <p className="medico-modal-label">Formação:</p>
                  <p className="medico-modal-linha">
                    {medicoSelecionado.formacao}
                  </p>
                </div>
              </div>

              <div className="medico-modal-body">
                <div className="medico-modal-bloco">
                  <p className="medico-modal-label">Especialidade:</p>
                  <p className="medico-modal-linha">
                    {medicoSelecionado.especialidade}
                  </p>
                </div>

                <div className="medico-modal-bloco">
                  <p className="medico-modal-label">CRM:</p>
                  <p className="medico-modal-linha">{medicoSelecionado.crm}</p>
                </div>

                <div className="medico-modal-bloco">
                  <p className="medico-modal-label">Tempo de atuação:</p>
                  <p className="medico-modal-linha">
                    {medicoSelecionado.tempoAtuacao}
                  </p>
                </div>

                <div className="medico-modal-bloco">
                  <p className="medico-modal-label">Horário disponível:</p>
                  <p className="medico-modal-linha">
                    {medicoSelecionado.horario}
                  </p>
                </div>

                <div className="medico-modal-bloco">
                  <p className="medico-modal-label">
                    Número de pacientes atendidos:
                  </p>
                  <p className="medico-modal-linha">
                    {medicoSelecionado.atendimentos}
                  </p>
                </div>

                <div className="medico-modal-botoes">
                  <button
                    type="button"
                    className="btn-medico-voltar"
                    onClick={fecharModal}
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    className="btn-medico-agendar"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        localStorage.setItem(
                          'medicoSelecionado',
                          JSON.stringify(medicoSelecionado)
                        );
                      }
                      navigate('/agendamento', {
                        state: { medico: medicoSelecionado },
                      });
                    }}
                  >
                    Agendar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Medicos;

