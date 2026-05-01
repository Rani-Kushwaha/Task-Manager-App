const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const prisma = new PrismaClient();

// Get tasks for a project
router.get('/project/:projectId', auth, async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: { projectId: req.params.projectId },
    include: { assignee: { select: { id: true, name: true, email: true } } }
  });
  res.json(tasks);
});

// Create task
router.post('/', auth, async (req, res) => {
  const { title, projectId, assigneeId, dueDate } = req.body;
  if (!title || !projectId) return res.status(400).json({ error: 'Title and projectId required' });

  // Only admins can assign tasks
  if (assigneeId) {
    const member = await prisma.teamMember.findUnique({
      where: { userId_projectId: { userId: req.user.id, projectId } }
    });
    if (member?.role !== 'ADMIN') return res.status(403).json({ error: 'Only admins can assign tasks' });
  }

  const task = await prisma.task.create({
    data: { title, projectId, assigneeId: assigneeId || null, dueDate: dueDate ? new Date(dueDate) : null },
    include: { assignee: { select: { id: true, name: true, email: true } } }
  });
  res.json(task);
});

// Update task status (or any field)
router.patch('/:id', auth, async (req, res) => {
  const { status, title, assigneeId } = req.body;
  const task = await prisma.task.findUnique({ where: { id: req.params.id } });
  
  // Only admins can change assignee
  if (assigneeId !== undefined) {
    const member = await prisma.teamMember.findUnique({
      where: { userId_projectId: { userId: req.user.id, projectId: task.projectId } }
    });
    if (member?.role !== 'ADMIN') return res.status(403).json({ error: 'Only admins can assign tasks' });
  }

  const updatedTask = await prisma.task.update({
    where: { id: req.params.id },
    data: { 
      ...(status && { status }), 
      ...(title && { title }), 
      ...(assigneeId !== undefined && { assigneeId: assigneeId || null })
    },
    include: { assignee: { select: { id: true, name: true, email: true } } }
  });
  res.json(updatedTask);
});

// Delete task (ADMIN only)
router.delete('/:id', auth, async (req, res) => {
  const task = await prisma.task.findUnique({ where: { id: req.params.id } });
  const member = await prisma.teamMember.findUnique({
    where: { userId_projectId: { userId: req.user.id, projectId: task.projectId } }
  });
  if (member?.role !== 'ADMIN') return res.status(403).json({ error: 'Admins only' });

  await prisma.task.delete({ where: { id: req.params.id } });
  res.json({ message: 'Deleted' });
});

module.exports = router;