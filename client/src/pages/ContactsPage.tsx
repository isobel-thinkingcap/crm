import { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, MenuItem, Paper, Select, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography,
  CircularProgress, InputLabel, FormControl,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getContacts, createContact, updateContact, deleteContact, type Contact, type ContactInput } from '../api/contacts';
import { getCompanies, type Company } from '../api/companies';

const emptyForm: ContactInput = { firstName: '', lastName: '', email: '', phone: '', title: '', notes: '', companyId: '' };

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [form, setForm] = useState<ContactInput>(emptyForm);

  const load = () => Promise.all([getContacts(), getCompanies()]).then(([c, co]) => {
    setContacts(c); setCompanies(co); setLoading(false);
  });

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (c: Contact) => { setEditing(c); setForm({ firstName: c.firstName, lastName: c.lastName, email: c.email ?? '', phone: c.phone ?? '', title: c.title ?? '', notes: c.notes ?? '', companyId: c.companyId ?? '' }); setOpen(true); };

  const handleSave = async () => {
    const data = { ...form, companyId: form.companyId || undefined };
    if (editing) await updateContact(editing.id, data);
    else await createContact(data);
    setOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this contact?')) { await deleteContact(id); load(); }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h1">Contacts</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>Add Contact</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Company</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map(c => (
              <TableRow key={c.id}>
                <TableCell>{c.firstName} {c.lastName}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.title}</TableCell>
                <TableCell>{c.company?.name}</TableCell>
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
        <DialogTitle>{editing ? 'Edit Contact' : 'New Contact'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="First Name" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} fullWidth required />
            <TextField label="Last Name" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} fullWidth required />
          </Box>
          <TextField label="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} fullWidth />
          <TextField label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} fullWidth />
          <TextField label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} fullWidth />
          <FormControl fullWidth>
            <InputLabel>Company</InputLabel>
            <Select label="Company" value={form.companyId ?? ''} onChange={e => setForm(f => ({ ...f, companyId: e.target.value }))}>
              <MenuItem value="">None</MenuItem>
              {companies.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
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
