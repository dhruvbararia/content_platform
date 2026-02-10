import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDocuments, createDocument } from '../services/documents';

export const useDocuments = (filters?: any) => {
  return useQuery({
    queryKey: ['documents', filters],
    queryFn: () => getDocuments(filters)
  });
};

export const useCreateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDocument,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] })
  });
};
