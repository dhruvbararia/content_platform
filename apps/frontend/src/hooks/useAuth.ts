import { useMutation, useQuery } from '@tanstack/react-query';
import { login, getMe } from '@/services/auth';

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
    }
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false
  });
};
