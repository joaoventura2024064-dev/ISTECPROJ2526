import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/common/Layout';
import AuthLayout from './components/auth/AuthLayout';
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const RecoverPassword = lazy(() => import('./pages/RecoverPassword'));
const NewSimulation = lazy(() => import('./pages/NewSimulation'));
const SimulationView = lazy(() => import('./pages/SimulationView'));
const UsersManagement = lazy(() => import('./pages/UsersManagement'));
const UserDetail = lazy(() => import('./pages/UserDetail'));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={
          <div className="flex items-center justify-center h-screen w-screen bg-primary-500">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-base-50"></div>
          </div>}>
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
                <Route path="simulador/:id" element={<SimulationView />} />
                <Route path="utilizadores" element={<UsersManagement />} />
                <Route path="utilizador/:id" element={<UserDetail />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
