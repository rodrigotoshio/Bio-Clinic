import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import '../styles/SharedBackground.css';
import '../styles/Login.css';
import { login, loginFace, getFaceDescriptor } from '../services/authService';

const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    return true;
};

function Login() {
    const navigate = useNavigate();
    
    // Estados de Dados
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [targetDescriptor, setTargetDescriptor] = useState(null); 
    
    // Estados de Fluxo
    const [metodoLogin, setMetodoLogin] = useState('padrao'); 
    
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [statusFaceID, setStatusFaceID] = useState('');
    
    // Câmera e IA
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    
    // Refs de controle
    const detectionInterval = useRef(null);
    const attemptsRef = useRef(0);

    // 1. Carregar Modelos
    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models';
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
                ]);
                setModelsLoaded(true);
            } catch (error) {
                console.error("Erro FaceAPI:", error);
                setMensagem("Erro ao carregar IA.");
            }
        };
        loadModels();
    }, []);

    // 2. Controle da Câmera
    useEffect(() => {
        const startCamera = async () => {
            if (modelsLoaded && !cameraStream) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    setCameraStream(stream);
                } catch (err) {
                    setMensagem("Erro ao abrir câmera.");
                    setMetodoLogin('cpf_facial');
                }
            }
        };
        const stopCamera = () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
                setCameraStream(null);
            }
            if (detectionInterval.current) clearInterval(detectionInterval.current);
        };

        if (metodoLogin === 'faceid') startCamera();
        else stopCamera();

        return () => { 
            if (cameraStream) cameraStream.getTracks().forEach(track => track.stop()); 
            if (detectionInterval.current) clearInterval(detectionInterval.current);
        };
    }, [metodoLogin, modelsLoaded]);

    // 3. Anexar stream e iniciar
    useEffect(() => {
        if (cameraStream && videoRef.current) {
            videoRef.current.srcObject = cameraStream;
            videoRef.current.onplay = () => {
                startFaceDetection();
            };
        }
    }, [cameraStream]);

    // --- LÓGICA DE DETECÇÃO ---
    const startFaceDetection = () => {
        if (detectionInterval.current) clearInterval(detectionInterval.current);
        
        attemptsRef.current = 0; 
        setStatusFaceID("Procurando rosto...");

        detectionInterval.current = setInterval(async () => {
            attemptsRef.current += 1;

            if (attemptsRef.current > 30) {
                clearInterval(detectionInterval.current);
                setStatusFaceID("Tempo esgotado.");
                navigate('/face-erro');
                return;
            }

            if (!videoRef.current || !canvasRef.current || !targetDescriptor) return;

            const detections = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (detections) {
                const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
                faceapi.matchDimensions(canvasRef.current, displaySize);
                
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                faceapi.draw.drawDetections(canvasRef.current, resizedDetections);

                const distance = faceapi.euclideanDistance(detections.descriptor, targetDescriptor);
                
                if (distance < 0.5) {
                    setStatusFaceID("Rosto confirmado! Entrando...");
                    clearInterval(detectionInterval.current); 
                    
                    try {
                        const cpfLimpo = cpf.replace(/[^\d]+/g, '');
                        const response = await loginFace(cpfLimpo);
                        localStorage.setItem('token', response.token);
                        
                        // --- ALTERAÇÃO 1: Redirecionar FaceID para Home ---
                        // Antes estava: navigate('/face-sucesso');
                        navigate('/home'); 

                    } catch (error) {
                        navigate('/face-erro');
                    }
                } else {
                    const restantes = 30 - attemptsRef.current;
                    setStatusFaceID(`Rosto incorreto. Tente aproximar. (${restantes})`);
                }
            } else {
                const restantes = 30 - attemptsRef.current;
                setStatusFaceID(`Nenhum rosto detectado... (${restantes})`);
            }
        }, 500);
    };

    // --- AÇÕES DO USUÁRIO ---

    const handleCpfChange = (e) => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 11) v = v.substring(0, 11);
        if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
        else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
        else if (v.length > 3) v = v.replace(/(\d{3})(\d+)/, '$1.$2');
        setCpf(v);
        setMensagem('');
    };

    const selecionarModoFacial = () => {
        setMensagem(''); setNome(''); setSenha('');
        setMetodoLogin('cpf_facial');
    };

    const iniciarEscaneamento = async () => {
        const cpfLimpo = cpf.replace(/[^\d]+/g, '');
        
        if (!validarCPF(cpfLimpo)) {
            setMensagem('CPF inválido.'); return;
        }
        if (!modelsLoaded) {
            setMensagem('Sistema carregando...'); return;
        }

        setMensagem('');
        setStatusFaceID('Buscando seus dados...');

        try {
            const descriptorString = await getFaceDescriptor(cpfLimpo);
            
            if (!descriptorString) {
                setMensagem('Biometria não cadastrada para este CPF.');
                return;
            }

            let arr;
            if (Array.isArray(descriptorString)) {
                arr = descriptorString;
            } else {
                const cleanStr = typeof descriptorString === 'string' ? descriptorString.replace(/[\[\]]/g, '') : '';
                arr = cleanStr.split(',').map(num => parseFloat(num));
            }
            
            const float32 = new Float32Array(arr);
            setTargetDescriptor(float32);
            setMetodoLogin('faceid');

        } catch (error) {
            console.error(error);
            setMensagem(error.message || 'Erro ao buscar biometria.');
        }
    };

    const handleLoginPadrao = async (e) => {
        e.preventDefault();
        setMensagem('');
        if (!nome.trim()) { setMensagem('Nome obrigatório.'); return; }
        if (senha.length < 6) { setMensagem('Senha curta.'); return; }

        try {
            const response = await login({ usuario: nome, senha });
            localStorage.setItem('token', response.token);
            
            // --- ALTERAÇÃO 2: Redirecionar Login Padrão para Home ---
            // Antes estava: navigate('/perfil');
            navigate('/home'); 

        } catch (err) {
            setMensagem("Nome ou senha inválidos");
        }
    };

    const voltarParaPadrao = () => {
        setMetodoLogin('padrao');
        setMensagem('');
        setStatusFaceID('');
        if (detectionInterval.current) clearInterval(detectionInterval.current);
    };

    // --- RENDER ---
    return (
        <div className="background-container">
            <div className="login-card">
                <form className="login-form" onSubmit={metodoLogin === 'padrao' ? handleLoginPadrao : (e) => e.preventDefault()}>

                    {metodoLogin !== 'faceid' && (
                        <>
                            <h1>Login</h1>
                            <p className="subtitulo">
                                {metodoLogin === 'cpf_facial' ? 'Identificação Facial' : 'Bem-vindo de volta'}
                            </p>
                        </>
                    )}

                    {mensagem && <p className="mensagem-alerta">{mensagem}</p>}
                    {statusFaceID && <p className="mensagem-sucesso">{statusFaceID}</p>}

                    {/* Nome (Modo Padrão) */}
                    {metodoLogin === 'padrao' && (
                        <div className="input-group">
                            <label>Nome Completo</label>
                            <div className="input-field">
                                <input 
                                    type="text" placeholder="Digite seu nome"
                                    value={nome} onChange={e => setNome(e.target.value)}
                                />
                                <i className="fa-solid fa-user icon"></i>
                            </div>
                        </div>
                    )}

                    {/* Senha (Modo Padrão) */}
                    {metodoLogin === 'padrao' && (
                        <div className="input-group">
                            <label>Senha</label>
                            <div className="input-field">
                                <input 
                                    type={senhaVisivel ? "text" : "password"}
                                    value={senha} onChange={e => setSenha(e.target.value)}
                                />
                                <i className={senhaVisivel ? "fa-solid fa-eye-slash icon" : "fa-solid fa-eye icon"}
                                   onClick={() => setSenhaVisivel(!senhaVisivel)} style={{cursor:'pointer'}}></i>
                            </div>
                        </div>
                    )}

                    {/* CPF (Modo Preparo Facial) */}
                    {metodoLogin === 'cpf_facial' && (
                        <div className="input-group">
                            <label>Informe seu CPF</label>
                            <div className="input-field">
                                <input 
                                    type="text" placeholder="000.000.000-00"
                                    value={cpf} onChange={handleCpfChange} autoFocus
                                />
                                <i className="fa-solid fa-id-card icon"></i>
                            </div>
                        </div>
                    )}

                    {/* Câmera (Modo FaceID) */}
                    {metodoLogin === 'faceid' && (
                        <div className="scan-placeholder">
                            {cameraStream ? (
                                <video ref={videoRef} autoPlay playsInline muted className="camera-feed" />
                            ) : (
                                <span className="camera-text">Ligando câmera...</span>
                            )}
                            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
                            
                            <button type="button" className="btn-opcao btn-voltar btn-faceid-voltar" 
                                onClick={() => {
                                    setMetodoLogin('cpf_facial');
                                    setTargetDescriptor(null); 
                                }}>
                                Cancelar
                            </button>
                        </div>
                    )}

                    {/* Botões */}
                    {metodoLogin === 'padrao' && (
                        <div className="opcoes-entrada">
                            <div className="botoes-opcoes">
                                <button type="button" className="btn-opcao" onClick={selecionarModoFacial}>
                                    <i className="fa-solid fa-face-viewfinder"></i> FaceID
                                </button>
                                <button type="submit" className="btn-opcao" >
                                    ENTRAR
                                </button>
                            </div>
                        </div>
                    )}

                    {metodoLogin === 'cpf_facial' && (
                        <div className="opcoes-entrada">
                            <button type="button" className="btn-opcao" onClick={iniciarEscaneamento}
                                style={{ width: '100%', marginBottom: '10px', backgroundColor: '#d493a7' }}>
                                ESCANEAR ROSTO <i className="fa-solid fa-camera"></i>
                            </button>
                            <p style={{cursor:'pointer', color:'#630527', fontSize:'13px', textAlign:'center'}} 
                               onClick={voltarParaPadrao}>
                                <i className="fa-solid fa-arrow-left"></i> Voltar para Login com Senha
                            </p>
                        </div>
                    )}

                    <p className="link-cadastro">Não tem login? <Link to="/cadastro">Cadastre-se</Link></p>
                </form>
            </div>
        </div>
    );
}

export default Login;