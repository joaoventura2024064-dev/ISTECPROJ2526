import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/common/Layout';
import AuthLayout from './components/auth/AuthLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RecoverPassword from './pages/RecoverPassword';
import NewSimulation from './pages/NewSimulation';
import SimulationResult from './pages/SimulationResult';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/registar" element={<Register />} />
            <Route path="/recuperar-password" element={<RecoverPassword />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="simulador" element={<NewSimulation />} />
              <Route path="simulador/:id" element={<SimulationResult />} />
              <Route path="perfil" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
