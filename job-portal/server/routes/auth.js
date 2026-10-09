import express from 'express';
import crypto from 'crypto';
import { db } from '../db.js';

const router = express.Router();

// GET all demo/sample users for quick role switcher
router.get('/users', (req, res) => {
  const data = db.get();
  res.json(data.users || []);
});

// POST login
router.post('/login', (req, res) => {
  const { email, role } = req.body;
  const data = db.get();

  let user = (data.users || []).find(u => u.email.toLowerCase() === (email || '').toLowerCase());

  if (!user && role) {
    // Fallback to first user matching role if email not found
    user = (data.users || []).find(u => u.role === role);
  }

  if (!user) {
    return res.status(401).json({ error: 'User not found. Please register or choose a demo profile.' });
  }

  res.json({
    user,
    token: `demo-token-${user.id}-${Date.now()}`
  });
});

// POST register
router.post('/register', (req, res) => {
  const { name, email, role = 'candidate', companyName, title } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const data = db.get();
  const existing = (data.users || []).find(u => u.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newUser = {
    id: `user-${crypto.randomUUID().slice(0, 8)}`,
    name,
    email,
    role: role === 'employer' ? 'employer' : 'candidate',
    title: title || (role === 'employer' ? 'Hiring Lead' : 'Software Specialist'),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    bio: '',
    skills: [],
    location: 'United States',
    companyName: role === 'employer' ? (companyName || 'My Company') : undefined,
    companyLogo: role === 'employer' ? `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(companyName || 'Company')}` : undefined
  };

  data.users.push(newUser);
  db.save(data);

  res.status(201).json({
    user: newUser,
    token: `demo-token-${newUser.id}-${Date.now()}`
  });
});

// PUT update profile
router.put('/profile/:id', (req, res) => {
  const data = db.get();
  const index = (data.users || []).findIndex(u => u.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const updated = {
    ...data.users[index],
    ...req.body,
    id: data.users[index].id // keep original ID
  };

  data.users[index] = updated;
  db.save(data);

  res.json(updated);
});

export default router;
