import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography, CircularProgress } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import HandshakeIcon from '@mui/icons-material/Handshake';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { getContacts } from '../api/contacts';
import { getCompanies } from '../api/companies';
import { getDeals, STAGE_LABELS, type DealStage } from '../api/deals';

export default function DashboardPage() {
  const [counts, setCounts] = useState({ contacts: 0, companies: 0, deals: 0, pipeline: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getContacts(), getCompanies(), getDeals()]).then(([contacts, companies, deals]) => {
      const pipeline = deals
        .filter(d => !['CLOSED_WON', 'CLOSED_LOST'].includes(d.stage))
        .reduce((sum, d) => sum + (d.value ?? 0), 0);
      setCounts({ contacts: contacts.length, companies: companies.length, deals: deals.length, pipeline });
      setLoading(false);
    });
  }, []);

  if (loading) return <CircularProgress />;

  const stats = [
    { label: 'Contacts', value: counts.contacts, icon: <PeopleIcon fontSize="large" color="primary" /> },
    { label: 'Companies', value: counts.companies, icon: <BusinessIcon fontSize="large" color="secondary" /> },
    { label: 'Deals', value: counts.deals, icon: <HandshakeIcon fontSize="large" sx={{ color: 'success.main' }} /> },
    { label: 'Pipeline Value', value: `$${counts.pipeline.toLocaleString()}`, icon: <TrendingUpIcon fontSize="large" sx={{ color: 'warning.main' }} /> },
  ];

  return (
    <Box>
      <Typography variant="h5" component="h1" gutterBottom>Dashboard</Typography>
      <Grid container spacing={3}>
        {stats.map(s => (
          <Grid item xs={12} sm={6} md={3} key={s.label}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {s.icon}
                <Box>
                  <Typography variant="h4" component="p">{s.value}</Typography>
                  <Typography color="text.secondary">{s.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
