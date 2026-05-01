const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const prisma = new PrismaClient();

// Get my projects
router.get('/', auth, async (req, res) => {
  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: req.user.id },
        { members: { some: { userId: req.user.id } } }
      ]
    },
    include: { members: { include: { user: true } }, tasks: true }
  });
  res.json(projects);
});

// Create project (creator becomes ADMIN)
router.post('/', auth, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });

  const project = await prisma.project.create({
    data: {
      name,
      ownerId: req.user.id,
      members: { create: { userId: req.user.id, role: 'ADMIN' } }
    }
  });
  res.json(project);
});

// Add member (ADMIN only)
router.post('/:id/members', auth, async (req, res) => {
  const member = await prisma.teamMember.findUnique({
    where: { userId_projectId: { userId: req.user.id, projectId: req.params.id } }
  });
  if (member?.role !== 'ADMIN') return res.status(403).json({ error: 'Admins only' });

  const { email, role } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const newMember = await prisma.teamMember.create({
    data: { userId: user.id, projectId: req.params.id, role: role || 'MEMBER' }
  });
  res.json(newMember);
});

module.exports = router;