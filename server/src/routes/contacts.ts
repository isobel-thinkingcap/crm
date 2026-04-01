import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (_req, res) => {
  const contacts = await prisma.contact.findMany({
    include: { company: true },
    orderBy: { lastName: 'asc' },
  });
  res.json(contacts);
});

router.get('/:id', async (req, res) => {
  const contact = await prisma.contact.findUnique({
    where: { id: req.params.id },
    include: { company: true, deals: true },
  });
  if (!contact) return res.status(404).json({ error: 'Not found' });
  res.json(contact);
});

router.post('/', async (req, res) => {
  const { firstName, lastName, email, phone, title, notes, companyId } = req.body;
  const contact = await prisma.contact.create({
    data: { firstName, lastName, email, phone, title, notes, companyId },
    include: { company: true },
  });
  res.status(201).json(contact);
});

router.put('/:id', async (req, res) => {
  const { firstName, lastName, email, phone, title, notes, companyId } = req.body;
  const contact = await prisma.contact.update({
    where: { id: req.params.id },
    data: { firstName, lastName, email, phone, title, notes, companyId },
    include: { company: true },
  });
  res.json(contact);
});

router.delete('/:id', async (req, res) => {
  await prisma.contact.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
