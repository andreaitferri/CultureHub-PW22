import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthForm } from '../components/forms/AuthForm';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  return (
    <AuthForm
      title="Login"
      submitLabel="Accedi"
      onSubmit={async ({ email, password }) => {
        try {
          await login(email, password);
          navigate('/');
        } catch (error: any) {
          toast.error(error.response?.data?.detail || 'Login non riuscito');
        }
      }}
      extra={<p className="text-secondary">Usa le credenziali del backend seed.</p>}
    />
  );
}
