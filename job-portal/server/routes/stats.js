import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET categories with real-time job counts
router.get('/categories', (req, res) => {
  const data = db.get();
  const jobs = data.jobs || [];

  const defaultCategories = [
    { name: "Software Engineering", icon: "Code", count: 0 },
    { name: "Design", icon: "Palette", count: 0 },
    { name: "Product Management", icon: "Layers", count: 0 },
    { name: "Data Science", icon: "BarChart3", count: 0 },
    { name: "DevOps & Cloud", icon: "Cloud", count: 0 },
    { name: "Marketing", icon: "Megaphone", count: 0 }
  ];

  jobs.forEach(job => {
    const cat = defaultCategories.find(c => c.name.toLowerCase() === (job.category || '').toLowerCase());
    if (cat) {
      cat.count += 1;
    }
  });

  res.json(defaultCategories);
});

// GET general portal stats
router.get('/stats', (req, res) => {
  const data = db.get();
  const jobs = data.jobs || [];
  const applications = data.applications || [];
  const users = data.users || [];

  const companiesSet = new Set(jobs.map(j => j.company));

  res.json({
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.status === 'active').length,
    totalCompanies: companiesSet.size,
    totalApplications: applications.length,
    totalCandidates: users.filter(u => u.role === 'candidate').length
  });
});

// POST reset database to seed
router.post('/reset', (req, res) => {
  const fresh = db.reset();
  res.json({ message: 'Database reset to default seed data successfully', data: fresh });
});

export default router;
