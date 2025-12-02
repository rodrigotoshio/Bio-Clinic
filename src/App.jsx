import { Routes, Route, Navigate } from 'react-router-dom';

// --- Importações do Projeto do Amigo ---
import Login from './components/Login.jsx';
import Cadastro from './components/Cadastro.jsx';
import FaceSuccess from './components/FaceSuccess.jsx';
import FaceError from './components/FaceError.jsx';
import PermissaoLocalizacao from './components/PermissaoLocalizacao.jsx';
import RoutesList from './components/RoutesList.jsx';
import Perfil from './components/Perfil.jsx';
import PrivateRoute from './components/PrivateRoute.jsx'; // Se forem usar proteção de rota
import Medicos from './components/Medicos.jsx';
import MinhasConsultas from './components/MinhasConsultas.jsx';
import ConsultaDetalhe from './components/ConsultaDetalhe.jsx';
import Agendamento from './components/Agendamento.jsx';
import ConfirmacaoAgendamento from './components/ConfirmacaoAgendamento.jsx';
import QrCodeConsulta from './components/QrCodeConsulta.jsx';
import AdmAgendamentos from './components/AdmAgendamentos.jsx';
import AdmDetalhesAgendamento from './components/AdmDetalhesAgendamento.jsx';

// --- SUA IMPORTAÇÃO (AQUI ENTRA O SEU CÓDIGO) ---
// Certifique-se que moveu seu arquivo Home.jsx para a pasta components
import Home from './components/Home.jsx'; 

function App() {
  return (
    <Routes>
      {/* --- Redirecionamento Inicial --- */}
      {/* Se quiser que o app abra direto no login, mude para to="/login" */}
      <Route path="/" element={<Navigate to="/login" />} /> 

      {/* --- Rotas de Autenticação (Amigo) --- */}
      <Route path="/login" element={<Login />} /> 
      <Route path="/cadastro" element={<Cadastro />} /> 
      <Route path="/face-sucesso" element={<FaceSuccess />} /> 
      <Route path="/face-erro" element={<FaceError />} />
      <Route path="/permissao-localizacao" element={<PermissaoLocalizacao />} />
      
      {/* Rotas Utilitárias */}
      <Route path="/routes-list" element={<RoutesList />} />
      <Route path="/medicos" element={<Medicos />} />
      <Route path="/consultas" element={<MinhasConsultas />} />
      <Route path="/consulta-detalhe" element={<ConsultaDetalhe />} />
      <Route path="/agendamento" element={<Agendamento />} />
      <Route path="/confirmacao" element={<ConfirmacaoAgendamento />} />
      <Route path="/qrcode-consulta" element={<QrCodeConsulta />} />
      <Route path="/adm-agendamentos" element={<AdmAgendamentos />} />
      <Route path="/adm-detalhes-agendamento" element={<AdmDetalhesAgendamento />} />

      {/* --- A FUSÃO ACONTECE AQUI --- */}
      
      {/* Rota da Home (Sua tela principal) */}
      {/* Coloquei dentro do PrivateRoute caso vocês queiram proteger o acesso */}
      <Route 
        path="/home" 
        element={
           // Se o PrivateRoute estiver funcionando, descomente as linhas abaixo:
           // <PrivateRoute>
             <Home />
           // </PrivateRoute>
        } 
      />

      <Route path="/perfil" element={<Perfil />} />
      
    </Routes>
  );
}

export default App;