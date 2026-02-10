import { useState } from 'react';
import { useLogin, useMe } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function Login() {
  const [email, setEmail] = useState('admin@platform.com');
  const [password, setPassword] = useState('admin123');
  const loginMutation = useLogin();
  const { data: user } = useMe();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  if (user) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Content Platform
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            className="w-full btn-primary"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        {loginMutation.error && (
          <p className="text-red-500 text-sm mt-4 text-center">
            {loginMutation.error.message}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-4 text-center">
          admin@platform.com / admin123
        </p>
      </div>
    </div>
  );
}
