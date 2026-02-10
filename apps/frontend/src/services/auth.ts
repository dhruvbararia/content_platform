const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
};

export const getMe = async () => {
  const token = localStorage.getItem('token');
  console.log(token);
  const response = await fetch(`${API_URL}/protected/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    throw new Error('Unauthorized');
  }

  return response.json();
};


