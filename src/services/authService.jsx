import api from './api';

/**
 * Registra um novo usuário.
 * @param {object} userData - Dados do usuário {nome, cpf, senha}.
 */
export const registrar = async (userData) => {
  try {
    const response = await api.post('/auth/registrar', {
      nome: userData.nome,
      cpf: userData.cpf, 
      senha: userData.senha
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao tentar cadastrar.');
  }
};

/**
 * Autentica um usuário com Nome (Usuário) e Senha.
 * @param {object} credentials - Credenciais { usuario, senha }.
 */
export const login = async (credentials) => {
  try {
    // ATENÇÃO: Certifique-se que seu Back-end tem esta rota '/auth/login-nome'
    // esperando receber "nome" e "senha" no body.
    const response = await api.post('/auth/login-nome', {
      
      // MUDANÇA AQUI: O Login.jsx envia 'usuario', então mapeamos para 'nome'
      // para enviar ao backend.
      nome: credentials.usuario, 
      senha: credentials.senha
    });
    
    return response.data;
  } catch (error) {
    // MUDANÇA AQUI: Atualizei a mensagem de erro padrão
    throw new Error(error.response?.data || 'Usuário ou senha inválidos.');
  }
};

/**
 * Desloga o usuário (remove o token).
 */
export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login'; 
};

/**
 * Registra o descritor facial para o usuário logado.
 * @param {string} descriptor - O descritor facial como string.
 */
export const registerFace = async (descriptor) => {
  try {
    const response = await api.post('/facial/register-face', { descriptor });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || error.message || 'Erro ao cadastrar rosto.');
  }
};

/**
 * Busca o descritor facial salvo para um CPF.
 * @param {string} cpf - CPF do usuário (sem formatação).
 */
export const getFaceDescriptor = async (cpf) => {
  try {
    // O FaceID continua usando CPF, então aqui NÃO mudamos nada. Está correto.
    const response = await api.get(`/auth/face-descriptor/${cpf}`);
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data || 'Nenhum rosto cadastrado para este CPF.');
  }
};

/**
 * Efetua o login após a validação facial do frontend.
 * @param {string} cpf - CPF do usuário (sem formatação).
 */
export const loginFace = async (cpf) => {
  try {
    // O Login facial também continua sendo amarrado ao CPF. Está correto.
    const response = await api.post('/auth/login-face', { cpf });
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data || 'Erro ao finalizar login facial.');
  }
};