import api from './client';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  title?: string;
  notes?: string;
  companyId?: string;
  company?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export type ContactInput = Omit<Contact, 'id' | 'company' | 'createdAt' | 'updatedAt'>;

export const getContacts = () => api.get<Contact[]>('/contacts').then(r => r.data);
export const getContact = (id: string) => api.get<Contact>(`/contacts/${id}`).then(r => r.data);
export const createContact = (data: ContactInput) => api.post<Contact>('/contacts', data).then(r => r.data);
export const updateContact = (id: string, data: ContactInput) => api.put<Contact>(`/contacts/${id}`, data).then(r => r.data);
export const deleteContact = (id: string) => api.delete(`/contacts/${id}`);
