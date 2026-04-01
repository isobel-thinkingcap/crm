import { useEffect, useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, TextField,
  Typography, CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getDeals, createDeal, updateDeal, deleteDeal, DEAL_STAGES, STAGE_LABELS, type Deal, type DealInput, type DealStage } from '../api/deals';
import { getContacts, type Contact } from '../api/contacts';
import { getCompanies, type Company } from '../api/companies';

const STAGE_COLORS: Record<DealStage, 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'> = {
  LEAD: 'default',
  QUALIFIED: 'info',
  PROPOSAL: 'primary',
  NEGOTIATION: 'warning',
  CLOSED_WON: 'success',
  CLOSED_LOST: 'error',
};

const emptyForm: DealInput = { title: '', stage: 'LEAD', value: undefined, closeDate: undefined, notes: '', companyId: '', contactId: '' };

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Deal | null>(null);
  const [form, setForm] = useState<DealInput>(emptyForm);

  const load = () => Promise.all([getDeals(), getContacts(), getCompanies()]).then(([d, c, co]) => {
    setDeals(d); setContacts(c); setCompanies(co); setLoading(false);
  });

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (d: Deal) => {
    setEditing(d);
    setForm({ title: d.title, stage: d.stage, value: d.value, closeDate: d.closeDate ? d.closeDate.slice(0, 10) : undefined, notes: d.notes ?? '', companyId: d.companyId ?? '', contactId: d.contactId ?? '' });
    setOpen(true);
  };

  const handleSave = async () => {
    const data = { ...form, companyId: form.companyId || undefined, contactId: form.contactId || undefined };
    if (editing) await updateDeal(editing.id, data);
    else await createDeal(data);
    setOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this deal?')) { await deleteDeal(id); load(); }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Deals</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>Add Deal</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Close Date</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deals.map(d => (
              <TableRow key={d.id}>
                <TableCell>{d.title}</TableCell>
                <TableCell><Chip label={STAGE_LABELS[d.stage]} color={STAGE_COLORS[d.stage]} size="small" /></TableCell>
                <TableCell>{d.value != null ? `$${d.value.toLocaleString()}` : ''}</TableCell>
                <TableCell>{d.closeDate ? new Date(d.closeDate).toLocaleDateString() : ''}</TableCell>
                <TableCell>{d.company?.name}</TableCell>
                <TableCell>{d.contact ? `${d.contact.firstName} ${d.contact.lastName}` : ''}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => openEdit(d)}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={() => handleDelete(d.id)}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Deal' : 'New Deal'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} fullWidth required />
          <FormControl fullWidth>
            <InputLabel>Stage</InputLabel>
            <Select label="Stage" value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value as DealStage }))}>
              {DEAL_STAGES.map(s => <MenuItem key={s} value={s}>{STAGE_LABELS[s]}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Value ($)" type="number" value={form.value ?? ''} onChange={e => setForm(f => ({ ...f, value: e.target.value ? parseFloat(e.target.value) : undefined }))} fullWidth />
          <TextField label="Close Date" type="date" value={form.closeDate ?? ''} onChange={e => setForm(f => ({ ...f, closeDate: e.target.value || undefined }))} fullWidth InputLabelProps={{ shrink: true }} />
          <FormControl fullWidth>
            <InputLabel>Company</InputLabel>
            <Select label="Company" value={form.companyId ?? ''} onChange={e => setForm(f => ({ ...f, companyId: e.target.value }))}>
              <MenuItem value="">None</MenuItem>
              {companies.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Contact</InputLabel>
            <Select label="Contact" value={form.contactId ?? ''} onChange={e => setForm(f => ({ ...f, contactId: e.target.value }))}>
              <MenuItem value="">None</MenuItem>
              {contacts.map(c => <MenuItem key={c.id} value={c.id}>{c.firstName} {c.lastName}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} fullWidth multiline rows={3} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
