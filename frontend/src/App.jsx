import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import GroupPage from './pages/GroupPage';

function App() {
  return (
    <div className="bg-background min-h-screen text-foreground font-sans antialiased">
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/group/:groupId" element={<GroupPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
