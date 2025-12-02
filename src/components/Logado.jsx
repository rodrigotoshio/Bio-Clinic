import React from 'react';
import '../styles/SharedBackground.css'; // Reutilizando o fundo
import '../styles/Login.css'; // Reutilizando o estilo do card
import { Link } from 'react-router-dom'; // Para navegar para o perfil

function Logado() {
  return (
    <div className="background-container">
      <div className="login-card">
        
        <h1 style={{ textAlign: 'center', fontSize: '2.5rem', color: '#FFF' }}>
          Login OK
        </h1>

        <p className="subtitulo" style={{ textAlign: 'center', marginTop: '10px' }}>
            Seu login facial foi autenticado com sucesso.
        </p>
        
        {/* Adicionei um link para o perfil, que é o próximo passo lógico */}
        <Link 
            to="/perfil" 
            className="btn-entrar" 
            style={{ textDecoration: 'none', marginTop: '30px', textAlign: 'center' }}
        >
          Ir para o Perfil
        </Link>

      </div>
    </div>
  );
}

export default Logado;