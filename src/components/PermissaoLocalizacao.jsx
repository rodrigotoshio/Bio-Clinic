import React from 'react';
import { useNavigate } from 'react-router-dom';
import LocationSVG from '../assets/imagens/Location.svg'; // Importa o SVG de localização

// Vamos re-utilizar o fundo e o cartão do Login
import '../styles/Login.css';
// E adicionar os estilos específicos desta tela
import '../styles/PermissaoLocalizacao.css';
import '../styles/SharedBackground.css'; // Importar o novo arquivo de fundo compartilhado

function PermissaoLocalizacao() {
    const navigate = useNavigate();

    function handlePermitir() {
        // 1. Tenta pedir a localização
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // SUCESSO: Navega para a tela principal (Home)
                console.log('Localização permitida:', position);
                navigate('/home'); // Navega para o dashboard
            },
            (error) => {
                // ERRO (Usuário bloqueou): Navega para a Home mesmo assim
                console.warn('Localização negada:', error);
                navigate('/home');
            }
        );
    }

    function handleAgoraNao() {
        // O usuário pulou. Apenas navega para a Home.
        console.log('Permissão de localização pulada.');
        navigate('/home');
    }

    return (
        <div className="background-container">
            {/* Reutilizamos o .login-card para manter o mesmo visual */}
            <div className="login-card"> 
                <form className="login-form">
                    
                    <h1 className="permissao-title">Permissão de Localização</h1>

                    {/* O container do ícone (baseado na imagem) */}
                    <div className="permissao-icon-container">
                        <img src={LocationSVG} alt="Location" className="permissao-icon" />
                    </div>

                    {/* O texto explicativo (baseado na imagem) */}
                    <p className="permissao-texto">
                    Para oferecer uma experiência personalizada e mostrar serviços próximos a você, precisamos acessar sua localização.                 </p>

                    {/* Os dois botões (baseado na imagem) */}
                    <div className="permissao-botoes-container">
                        <button 
                            type="button" 
                            className="btn-permitir" 
                            onClick={handlePermitir}
                        >
                            PERMITIR
                        </button>
                        
                        <button 
                            type="button" 
                            className="btn-agora-nao"
                            onClick={handleAgoraNao}
                        >
                            Agora não
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default PermissaoLocalizacao;