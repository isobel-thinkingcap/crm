import { useEffect, useState } from 'react';
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, TextField,
  Typography, CircularProgress, Link,
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

const emptyForm: DealInput = {
  title: '',
  organizationName: '',
  source: '',
  campaignTenderId: '',
  status: '',
  currency: '',
  value: undefined,
  amountPerYear: undefined,
  users: undefined,
  model: '',
  stage: 'LEAD',
  nextStep: '',
  taskDueDate: undefined,
  closeDate: undefined,
  lastActivity: undefined,
  driveFolderLink: '',
  notes: '',
  companyId: '',
  contactId: '',
};

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
    setForm({
      title: d.title,
      organizationName: d.organizationName ?? '',
      source: d.source ?? '',
      campaignTenderId: d.campaignTenderId ?? '',
      status: d.status ?? '',
      currency: d.currency ?? '',
      value: d.value,
      amountPerYear: d.amountPerYear,
      users: d.users,
      model: d.model ?? '',
      stage: d.stage,
      nextStep: d.nextStep ?? '',
      taskDueDate: d.taskDueDate ? d.taskDueDate.slice(0, 10) : undefined,
      closeDate: d.closeDate ? d.closeDate.slice(0, 10) : undefined,
      lastActivity: d.lastActivity ? d.lastActivity.slice(0, 10) : undefined,
      driveFolderLink: d.driveFolderLink ?? '',
      notes: d.notes ?? '',
      companyId: d.companyId ?? '',
      contactId: d.contactId ?? '',
    });
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
        <Typography variant="h5" component="h1">Deals</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>Add Deal</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Organization</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Amount/Year</TableCell>
              <TableCell>Next Step</TableCell>
              <TableCell>Task Due</TableCell>
              <TableCell>Close Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deals.map(d => (
              <TableRow key={d.id}>
                <TableCell>{d.title}</TableCell>
                <TableCell>{d.organizationName || d.company?.name || ''}</TableCell>
                <TableCell><Chip label={STAGE_LABELS[d.stage]} color={STAGE_COLORS[d.stage]} size="small" /></TableCell>
                <TableCell>{d.status || ''}</TableCell>
                <TableCell>
                  {d.amountPerYear != null
                    ? `${d.currency ? d.currency + ' ' : ''}${d.amountPerYear.toLocaleString()}`
                    : ''}
                </TableCell>
                <TableCell>{d.nextStep || ''}</TableCell>
                <TableCell>{d.taskDueDate ? new Date(d.taskDueDate).toLocaleDateString() : ''}</TableCell>
                <TableCell>{d.closeDate ? new Date(d.closeDate).toLocaleDateString() : ''}</TableCell>
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
          <TextField label="Organization Name" value={form.organizationName ?? ''} onChange={e => setForm(f => ({ ...f, organizationName: e.target.value }))} fullWidth />
          <TextField label="Source" value={form.source ?? ''} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} fullWidth />
          <TextField label="Campaign / Tender ID" value={form.campaignTenderId ?? ''} onChange={e => setForm(f => ({ ...f, campaignTenderId: e.target.value }))} fullWidth />
          <TextField label="Status" value={form.status ?? ''} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} fullWidth />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Currency" value={form.currency ?? ''} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} sx={{ width: 120 }} />
            <TextField label="Amount/Year" type="number" value={form.amountPerYear ?? ''} onChange={e => setForm(f => ({ ...f, amountPerYear: e.target.value ? parseFloat(e.target.value) : undefined }))} fullWidth />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Users" type="number" value={form.users ?? ''} onChange={e => setForm(f => ({ ...f, users: e.target.value ? parseInt(e.target.value) : undefined }))} fullWidth />
            <TextField label="Model" value={form.model ?? ''} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} fullWidth />
          </Box>
          <FormControl fullWidth>
            <InputLabel>Stage</InputLabel>
            <Select label="Stage" value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value as DealStage }))}>
              {DEAL_STAGES.map(s => <MenuItem key={s} value={s}>{STAGE_LABELS[s]}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Next Step" value={form.nextStep ?? ''} onChange={e => setForm(f => ({ ...f, nextStep: e.target.value }))} fullWidth />
          <TextField label="Task Due Date" type="date" value={form.taskDueDate ?? ''} onChange={e => setForm(f => ({ ...f, taskDueDate: e.target.value || undefined }))} fullWidth InputLabelProps={{ shrink: true }} />
          <TextField label="Close Date" type="date" value={form.closeDate ?? ''} onChange={e => setForm(f => ({ ...f, closeDate: e.target.value || undefined }))} fullWidth InputLabelProps={{ shrink: true }} />
          <TextField label="Last Activity" type="date" value={form.lastActivity ?? ''} onChange={e => setForm(f => ({ ...f, lastActivity: e.target.value || undefined }))} fullWidth InputLabelProps={{ shrink: true }} />
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
          <TextField label="Drive Folder Link" value={form.driveFolderLink ?? ''} onChange={e => setForm(f => ({ ...f, driveFolderLink: e.target.value }))} fullWidth />
          <TextField label="Notes" value={form.notes ?? ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} fullWidth multiline rows={3} />
          {form.driveFolderLink && (
            <Link href={form.driveFolderLink} target="_blank" rel="noopener" variant="body2">Open Drive Folder</Link>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
