import api from './client';

export type DealStage = 'LEAD' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';

export interface Deal {
  id: string;
  title: string;
  value?: number;
  stage: DealStage;
  closeDate?: string;
  notes?: string;
  companyId?: string;
  contactId?: string;
  company?: { id: string; name: string };
  contact?: { id: string; firstName: string; lastName: string };
  createdAt: string;
  updatedAt: string;
}

export type DealInput = Omit<Deal, 'id' | 'company' | 'contact' | 'createdAt' | 'updatedAt'>;

export const DEAL_STAGES: DealStage[] = ['LEAD', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'CLOSED_WON', 'CLOSED_LOST'];

export const STAGE_LABELS: Record<DealStage, string> = {
  LEAD: 'Lead',
  QUALIFIED: 'Qualified',
  PROPOSAL: 'Proposal',
  NEGOTIATION: 'Negotiation',
  CLOSED_WON: 'Closed Won',
  CLOSED_LOST: 'Closed Lost',
};

export const getDeals = () => api.get<Deal[]>('/deals').then(r => r.data);
export const getDeal = (id: string) => api.get<Deal>(`/deals/${id}`).then(r => r.data);
export const createDeal = (data: DealInput) => api.post<Deal>('/deals', data).then(r => r.data);
export const updateDeal = (id: string, data: DealInput) => api.put<Deal>(`/deals/${id}`, data).then(r => r.data);
export const deleteDeal = (id: string) => api.delete(`/deals/${id}`);
