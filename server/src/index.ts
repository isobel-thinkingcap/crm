import express from 'express';
import cors from 'cors';
import contactsRouter from './routes/contacts';
import companiesRouter from './routes/companies';
import dealsRouter from './routes/deals';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/contacts', contactsRouter);
app.use('/api/companies', companiesRouter);
app.use('/api/deals', dealsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
