import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/SharedBackground.css'; // Importar o novo arquivo de fundo compartilhado

function RoutesList() {
    const routes = [
        { path: '/login', name: 'Login (Alias)' },
        { path: '/cadastro', name: 'Cadastro' },
        { path: '/face-sucesso', name: 'FaceID Sucesso' },
        { path: '/face-erro', name: 'FaceID Erro' },
        { path: '/permissao-localizacao', name: 'Permissão Localização' },
        { path: '/medicos', name: 'Médicos' },
        {path: '/perfil', name: 'Perfil' },
        {path: '/logado', name: 'Logado' },
    ];

    return (
        <div className="background-container" style={{ 
            padding: '20px', 
            fontFamily: 'Arial, sans-serif', 
            color: 'white', 
            zIndex: 1 // Garante que o conteúdo fique acima do fundo
        }}>
            <h1>Lista de Rotas</h1>
            <p>Clique para navegar:</p>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {routes.map((route, index) => (
                    <li key={index} style={{ marginBottom: '10px' }}>
                        <Link to={route.path} style={{ 
                            textDecoration: 'none', 
                            color: '#007bff', 
                            fontSize: '18px',
                            fontWeight: 'bold'
                        }}>
                            {route.name} ({route.path})
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RoutesList;
