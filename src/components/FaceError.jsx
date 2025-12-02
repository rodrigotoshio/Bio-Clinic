import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importa Link e useNavigate
import CancelSVG from '../assets/imagens/Cancel.svg'; // Importa o SVG de cancelamento

// Reutiliza o fundo do Login e estilos gerais de card
import '../styles/Login.css';
// Adiciona os estilos específicos desta tela de erro
import '../styles/FaceError.css';
import '../styles/SharedBackground.css'; // Importar o novo arquivo de fundo compartilhado

function FaceError() {
    const navigate = useNavigate(); // Hook para navegação

    function handleVoltar() {
        navigate('/login'); // Volta para a tela de login, onde o FaceID pode ser tentado novamente.
    }

    return (
        <div className="background-container">
            <div className="face-error-card"> 
                <form className="login-form">
                    
                    {/* O container de erro (ícone e texto) */}
                    <div className="faceid-error-container">
                        <img src={CancelSVG} alt="Cancel" className="face-icon-error" />
                        <p className="faceid-error-message">FaceID não identificado. Tente novamente!</p>
                    </div>

                    {/* Botão de "Voltar" para a tela de Login */}
                    <button 
                        type="button" 
                        className="btn-opcao btn-voltar btn-error-voltar" /* Reutiliza estilos e adiciona um específico */
                        onClick={handleVoltar}
                    >
                        Voltar
                    </button>

                </form>
            </div>
        </div>
    );
}

export default FaceError;