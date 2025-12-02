import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importar useNavigate
import { registrar } from '../services/authService'; // Importar o service

// Função para validar CPF (sem alterações)
const validarCPF = (cpf) => {
    cpf = cpf.replace(/[.\\-\s]/g, ''); 
    if (cpf.length !== 11 || !/^\d{11}$/.test(cpf)) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    return true;
};

// Seus imports de CSS
import '../styles/Login.css';
import '../styles/Cadastro.css';
import '../styles/SharedBackground.css';

function Cadastro() {
    
    // Estados do formulário
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    
    // Estados de UI
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const [confirmaSenhaVisivel, setConfirmaSenhaVisivel] = useState(false);
    
    // Estados de erro
    const [cpfInvalido, setCpfInvalido] = useState(false);
    const [erroSenha, setErroSenha] = useState('');
    const [erroConfirmaSenha, setErroConfirmaSenha] = useState('');
    const [erroApi, setErroApi] = useState(''); // Para erros do backend

    const navigate = useNavigate(); // Para redirecionar

    // Handlers (limpando o erro da API ao digitar)
    const handleCpfChange = (e) => {
        const novoCpf = e.target.value;
        setCpf(novoCpf);
        setCpfInvalido(false); 
        setErroApi(''); 
    };
    const handleSenhaChange = (e) => {
        setSenha(e.target.value);
        setErroSenha(''); 
        setErroApi('');
    };
    const handleConfirmaSenhaChange = (e) => {
        setConfirmaSenha(e.target.value);
        setErroConfirmaSenha('');
        setErroApi('');
    };
    const handleNomeChange = (e) => {
        setNome(e.target.value);
        setErroApi('');
    };

    // Função de Submit (agora assíncrona)
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setErroApi(''); 

        // 1. Validações do Frontend
        if (!validarCPF(cpf)) {
            setCpfInvalido(true);
            return;
        }
        if (senha.length < 6) {
            setErroSenha('A senha deve ter no mínimo 6 caracteres.');
            return;
        }
        if (senha !== confirmaSenha) {
            setErroConfirmaSenha('As senhas não coincidem.');
            return;
        }

        // 2. Tentar enviar para o Backend
        try {
            const cpfLimpo = cpf.replace(/[.\\-\s]/g, ''); // Envia CPF sem formatação
            
            await registrar({
                nome: nome,
                cpf: cpfLimpo,
                senha: senha
            });

            // 3. Sucesso!
            alert('Cadastro realizado com sucesso!');
            navigate('/login'); // Redireciona para a tela de login

        } catch (error) {
            // 4. Erro do Backend
            // 'error' é a string que lançamos no authService
            setErroApi(error); 
        }
    };

    return (
        <div className="background-container">
            <div className="login-card"> 
                <form className="login-form" onSubmit={handleSubmit}> 
                    
                    <h1>Cadastro</h1>
                    <p className="subtitulo">Crie sua conta para continuar.</p>

                    {/* Mostra erro da API */}
                    {erroApi && <p className="mensagem-erro-api">{erroApi}</p>}

                    <div className="input-group">
                        <label htmlFor="nome">Nome completo</label>
                        <div className="input-field">
                            <input 
                                type="text" 
                                id="nome" 
                                name="nome" 
                                required 
                                value={nome}
                                onChange={handleNomeChange}
                            />
                            <i className="fa-solid fa-user icon"></i>
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="cpf">CPF</label>
                        <div className="input-field">
                            <input 
                                type="text" // Usar text para permitir formatação (máscara)
                                id="cpf" 
                                name="cpf" 
                                required 
                                placeholder="000.000.000-00" 
                                value={cpf}
                                onChange={handleCpfChange}
                                maxLength="14" // Se você usar máscara, ajuste
                            />
                            <i className="fa-solid fa-id-card icon"></i>
                        </div>
                        {cpfInvalido && <p className="mensagem-erro">CPF inválido. Verifique o número.</p>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="senha">Criar Senha</label>
                        <div className="input-field">
                            <input 
                                type={senhaVisivel ? "text" : "password"} 
                                id="senha" 
                                name="senha" 
                                required 
                                value={senha}
                                onChange={handleSenhaChange}
                            />
                            <i 
                                className={senhaVisivel ? "fa-solid fa-eye-slash icon" : "fa-solid fa-eye icon"}
                                onClick={() => setSenhaVisivel(!senhaVisivel)}
                                style={{ cursor: 'pointer' }}
                            ></i>
                        </div>
                        {erroSenha && <p className="mensagem-erro">{erroSenha}</p>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirmaSenha">Confirmar Senha</label>
                        <div className="input-field">
                            <input 
                                type={confirmaSenhaVisivel ? "text" : "password"} 
                                id="confirmaSenha" 
                                name="confirmaSenha" 
                                required 
                                value={confirmaSenha}
                                onChange={handleConfirmaSenhaChange}
                            />
                            <i 
                                className={confirmaSenhaVisivel ? "fa-solid fa-eye-slash icon" : "fa-solid fa-eye icon"}
                                onClick={() => setConfirmaSenhaVisivel(!confirmaSenhaVisivel)}
                                style={{ cursor: 'pointer' }}
                            ></i>
                        </div>
                        {erroConfirmaSenha && <p className="mensagem-erro">{erroConfirmaSenha}</p>}
                    </div>

                    <button type="submit" className="btn-cadastrar">CADASTRAR</button>

                    <p className="link-cadastro">
                        Já tem uma conta? <Link to="/login">Faça login aqui</Link>
                    </p>

                </form>
            </div>
        </div>
    );
}

export default Cadastro;