import { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Typography, CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getCompanies, createCompany, updateCompany, deleteCompany, type Company, type CompanyInput } from '../api/companies';

const emptyForm: CompanyInput = { name: '', website: '', phone: '', address: '', notes: '' };

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [form, setForm] = useState<CompanyInput>(emptyForm);

  const load = () => getCompanies().then(c => { setCompanies(c); setLoading(false); });

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (c: Company) => { setEditing(c); setForm({ name: c.name, website: c.website ?? '', phone: c.phone ?? '', address: c.address ?? '', notes: c.notes ?? '' }); setOpen(true); };

  const handleSave = async () => {
    if (editing) await updateCompany(editing.id, form);
    else await createCompany(form);
    setOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this company?')) { await deleteCompany(id); load(); }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Companies</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>Add Company</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Website</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Contacts</TableCell>
              <TableCell>Deals</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map(c => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.website}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c._count?.contacts ?? 0}</TableCell>
                <TableCell>{c._count?.deals ?? 0}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => openEdit(c)}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={() => handleDelete(c.id)}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Company' : 'New Company'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField label="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} fullWidth required />
          <TextField label="Website" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} fullWidth />
          <TextField label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} fullWidth />
          <TextField label="Address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} fullWidth />
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
