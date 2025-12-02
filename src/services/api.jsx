import axios from 'axios';

// Cria a instância do Axios com a URL base do seu backend
const api = axios.create({
  baseURL: 'http://localhost:8080'
});

// Interceptor: Roda ANTES de CADA requisição
api.interceptors.request.use(
  (config) => {
    // 1. Pega o token do localStorage
    const token = localStorage.getItem('token');
    
    // 2. Se o token existir, adiciona ao header 'Authorization'
    if (token) {
      // O formato 'Bearer' é o padrão. 
      // Verifique se seu backend espera esse formato.
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // 3. Retorna a configuração modificada
    return config; 
  },
  (error) => {
    // Em caso de erro na configuração
    return Promise.reject(error);
  }
);

export default api;