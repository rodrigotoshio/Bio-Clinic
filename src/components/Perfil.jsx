import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { registerFace, logout } from '../services/authService';
import '../styles/SharedBackground.css';
import '../styles/Perfil.css'; // <--- ADICIONADO: Importa o novo estilo específico

function Perfil() {
    const videoRef = useRef();
    const [status, setStatus] = useState('Aguarde...');
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [stream, setStream] = useState(null); 

    // 1. Carrega os modelos da face-api
    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models'; 
            setStatus('Carregando modelos de IA...');
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
                ]);
                setModelsLoaded(true);
                setStatus('Modelos carregados. Iniciando câmera...');
            } catch (error) {
                console.error("Erro ao carregar modelos:", error);
                setStatus('Erro ao carregar modelos de IA.');
            }
        };
        loadModels();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []); // Roda apenas uma vez

    // 2. Liga a câmera DEPOIS que os modelos carregarem
    useEffect(() => {
        if (modelsLoaded) {
            startVideo();
        }
    }, [modelsLoaded]); 

    // Função para ligar a câmera
    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(videoStream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = videoStream;
                    setStream(videoStream); // Salva o stream
                    setStatus('Câmera pronta. Posicione seu rosto.');
                }
            })
            .catch(err => {
                console.error("Erro ao ligar câmera: ", err);
                setStatus('Erro ao acessar a câmera. Verifique as permissões.');
            });
    };

    // 3. Função principal: Capturar e Cadastrar o Rosto
    const handleRegisterFace = async () => {
        if (!modelsLoaded || !videoRef.current || videoRef.current.readyState < 3) {
            setStatus('Aguarde, câmera ou modelos não estão prontos.');
            return;
        }

        setStatus('Analisando... Olhe para a câmera.');

        const detections = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detections) {
            setStatus('Nenhum rosto detectado. Tente se aproximar ou melhorar a iluminação.');
            return;
        }

        const descriptorString = detections.descriptor.toString();
        setStatus('Rosto detectado! Enviando para o servidor...');

        try {
            const responseMessage = await registerFace(descriptorString);
            setStatus(`Sucesso: ${responseMessage}`);
            
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        } catch (error) {
            setStatus(`Erro: ${error.message || error}`);
        }
    };

    return (
        <div className="background-container">
            <div className="login-card"> 
                <h2>Cadastro Facial</h2>
                <p>Use a câmera abaixo para cadastrar seu rosto. Este passo é necessário para o login facial.</p>
                
                <div className="camera-container">
                    <video ref={videoRef} autoPlay playsInline width="300" height="300" />
                </div>
                
                <p className="status-facial">Status: {status}</p>

                <button 
                    onClick={handleRegisterFace} 
                    disabled={!modelsLoaded} 
                    className="btn-entrar"
                >
                    {modelsLoaded ? 'Capturar e Salvar Rosto' : 'Carregando IA...'}
                </button>

                <button 
                    onClick={logout} 
                    className="btn-opcao btn-voltar"
                    style={{marginTop: '10px'}}
                >
                    Voltar
                </button>
            </div>
        </div>
    );
}

export default Perfil;