import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (_req, res) => {
  const companies = await prisma.company.findMany({
    include: { _count: { select: { contacts: true, deals: true } } },
    orderBy: { name: 'asc' },
  });
  res.json(companies);
});

router.get('/:id', async (req, res) => {
  const company = await prisma.company.findUnique({
    where: { id: req.params.id },
    include: { contacts: true, deals: true },
  });
  if (!company) return res.status(404).json({ error: 'Not found' });
  res.json(company);
});

router.post('/', async (req, res) => {
  const { name, website, phone, address, notes } = req.body;
  const company = await prisma.company.create({
    data: { name, website, phone, address, notes },
  });
  res.status(201).json(company);
});

router.put('/:id', async (req, res) => {
  const { name, website, phone, address, notes } = req.body;
  const company = await prisma.company.update({
    where: { id: req.params.id },
    data: { name, website, phone, address, notes },
  });
  res.json(company);
});

router.delete('/:id', async (req, res) => {
  await prisma.company.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
