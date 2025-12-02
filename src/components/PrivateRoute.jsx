import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Este componente "wrapper" protege rotas.
 * Ele verifica se um token existe no localStorage.
 * Se existir, renderiza o componente 'children' (a página protegida).
 * Se não, redireciona o usuário para a página de login.
 */
const PrivateRoute = ({ children }) => {
    // 1. Verifica se o token existe
    const token = localStorage.getItem('token');

    // 2. Retorna a página (children) se o token existir, ou redireciona para /login
    return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;