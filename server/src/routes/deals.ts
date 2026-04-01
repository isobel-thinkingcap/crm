import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (_req, res) => {
  const deals = await prisma.deal.findMany({
    include: { company: true, contact: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(deals);
});

router.get('/:id', async (req, res) => {
  const deal = await prisma.deal.findUnique({
    where: { id: req.params.id },
    include: { company: true, contact: true },
  });
  if (!deal) return res.status(404).json({ error: 'Not found' });
  res.json(deal);
});

router.post('/', async (req, res) => {
  const { title, value, stage, closeDate, notes, companyId, contactId } = req.body;
  const deal = await prisma.deal.create({
    data: {
      title,
      value: value ? parseFloat(value) : null,
      stage,
      closeDate: closeDate ? new Date(closeDate) : null,
      notes,
      companyId,
      contactId,
    },
    include: { company: true, contact: true },
  });
  res.status(201).json(deal);
});

router.put('/:id', async (req, res) => {
  const { title, value, stage, closeDate, notes, companyId, contactId } = req.body;
  const deal = await prisma.deal.update({
    where: { id: req.params.id },
    data: {
      title,
      value: value ? parseFloat(value) : null,
      stage,
      closeDate: closeDate ? new Date(closeDate) : null,
      notes,
      companyId,
      contactId,
    },
    include: { company: true, contact: true },
  });
  res.json(deal);
});

router.delete('/:id', async (req, res) => {
  await prisma.deal.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
