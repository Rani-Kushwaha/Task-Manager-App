const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const prisma = new PrismaClient();

// SIGNUP
router.post('/signup', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({ data: { name, email, password: hashed } });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch {
    res.status(400).json({ error: 'Email already exists' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

module.exports = router;