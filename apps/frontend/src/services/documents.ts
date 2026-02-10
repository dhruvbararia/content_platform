import { apiClient } from './http';

export const getDocuments = (filters?: any) => {
  return apiClient.get('/documents', { params: filters }).then(res => res.data);
};

export const createDocument = (formData: FormData) => {
  return apiClient.post('/documents', formData).then(res => res.data);
};
