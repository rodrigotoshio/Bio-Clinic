import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import CheckmarkSVG from '../assets/imagens/Checkmark.svg'; 

// Importação de Estilos
import '../styles/Login.css';
import '../styles/FaceSuccess.css';
import '../styles/SharedBackground.css'; 

function FaceSuccess() {
    const navigate = useNavigate(); 

    useEffect(() => {
        // Define o tempo de espera de 3 segundos (3000ms)
        const timer = setTimeout(() => {
            navigate('/logado'); 
        }, 3000);

        // Limpa o timer caso o usuário saia da tela antes do tempo (evita erros)
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="background-container">
            {/* Reutilizamos o .login-card para manter o mesmo visual */}
            <div className="face-success-card"> 
                {/* Mantive a classe 'login-form' para herdar os estilos, mas troquei 'form' por 'div' pois não há submit */}
                <div className="login-form">
                    
                    {/* O container de sucesso (ícone e texto) */}
                    <div className="faceid-success-container">
                        <img src={CheckmarkSVG} alt="Checkmark" className="face-icon-success" />
                        <p className="faceid-success-message">FaceID identificado com sucesso!</p>
                        
                        {/* Feedback visual de que o sistema vai mudar de tela sozinho */}
                        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px' }}>
                            Entrando em instantes...
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default FaceSuccess;