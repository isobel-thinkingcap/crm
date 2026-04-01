import api from './client';

export interface Company {
  id: string;
  name: string;
  website?: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  _count?: { contacts: number; deals: number };
}

export type CompanyInput = Omit<Company, 'id' | '_count' | 'createdAt' | 'updatedAt'>;

export const getCompanies = () => api.get<Company[]>('/companies').then(r => r.data);
export const getCompany = (id: string) => api.get<Company>(`/companies/${id}`).then(r => r.data);
export const createCompany = (data: CompanyInput) => api.post<Company>('/companies', data).then(r => r.data);
export const updateCompany = (id: string, data: CompanyInput) => api.put<Company>(`/companies/${id}`, data).then(r => r.data);
export const deleteCompany = (id: string) => api.delete(`/companies/${id}`);
