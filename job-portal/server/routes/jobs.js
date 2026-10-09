import express from 'express';
import { db } from '../db.js';
import crypto from 'crypto';

const router = express.Router();

// GET all jobs with filtering & search
router.get('/', (req, res) => {
  const data = db.get();
  let jobs = [...data.jobs];

  const {
    search,
    category,
    location,
    workplaceType,
    jobType,
    experienceLevel,
    salaryMin,
    employerId,
    sort
  } = req.query;

  // Filter by search query (title, company, description, requirements)
  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    jobs = jobs.filter(j => 
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.description.toLowerCase().includes(q) ||
      (j.requirements && j.requirements.some(r => r.toLowerCase().includes(q)))
    );
  }

  // Filter by category
  if (category && category !== 'All') {
    jobs = jobs.filter(j => j.category.toLowerCase() === category.toLowerCase());
  }

  // Filter by location
  if (location && location !== 'All') {
    jobs = jobs.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
  }

  // Filter by workplace type (Remote, Hybrid, On-site)
  if (workplaceType && workplaceType !== 'All') {
    jobs = jobs.filter(j => j.workplaceType.toLowerCase() === workplaceType.toLowerCase());
  }

  // Filter by job type (Full-time, Part-time, Contract, Internship)
  if (jobType && jobType !== 'All') {
    jobs = jobs.filter(j => j.jobType.toLowerCase() === jobType.toLowerCase());
  }

  // Filter by experience level
  if (experienceLevel && experienceLevel !== 'All') {
    jobs = jobs.filter(j => j.experienceLevel.toLowerCase() === experienceLevel.toLowerCase());
  }

  // Filter by minimum salary
  if (salaryMin && !isNaN(Number(salaryMin))) {
    const minVal = Number(salaryMin);
    jobs = jobs.filter(j => (j.salaryMax || j.salaryMin || 0) >= minVal);
  }

  // Filter by employerId (for employer dashboard)
  if (employerId) {
    jobs = jobs.filter(j => j.employerId === employerId);
  }

  // Sort
  if (sort === 'salary-high') {
    jobs.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
  } else if (sort === 'salary-low') {
    jobs.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0));
  } else if (sort === 'oldest') {
    jobs.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
  } else {
    // Default: newest first, with featured boosted
    jobs.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.postedDate) - new Date(a.postedDate);
    });
  }

  // Recalculate applicant counts accurately from applications table
  const applicationList = data.applications || [];
  jobs = jobs.map(j => ({
    ...j,
    applicantsCount: applicationList.filter(a => a.jobId === j.id).length
  }));

  res.json({
    total: jobs.length,
    jobs
  });
});

// GET single job by ID
router.get('/:id', (req, res) => {
  const data = db.get();
  const job = data.jobs.find(j => j.id === req.params.id);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  const applications = (data.applications || []).filter(a => a.jobId === job.id);
  const employer = (data.users || []).find(u => u.id === job.employerId);

  // Find related jobs in the same category
  const relatedJobs = data.jobs
    .filter(j => j.id !== job.id && j.category === job.category)
    .slice(0, 3);

  res.json({
    ...job,
    applicantsCount: applications.length,
    employer: employer ? {
      name: employer.name,
      companyName: employer.companyName,
      companyLogo: employer.companyLogo,
      companyWebsite: employer.companyWebsite,
      bio: employer.bio
    } : null,
    relatedJobs
  });
});

// POST create a new job
router.post('/', (req, res) => {
  const {
    title,
    company,
    companyLogo,
    location,
    workplaceType,
    jobType,
    experienceLevel,
    category,
    salaryMin,
    salaryMax,
    salaryCurrency = 'USD',
    description,
    requirements,
    responsibilities,
    benefits,
    featured = false,
    employerId = 'user-emp-1'
  } = req.body;

  if (!title || !company || !description) {
    return res.status(400).json({ error: 'Title, company, and description are required' });
  }

  const data = db.get();
  const newJob = {
    id: `job-${crypto.randomUUID().slice(0, 8)}`,
    title,
    company,
    companyLogo: companyLogo || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(company)}`,
    location: location || 'Remote',
    workplaceType: workplaceType || 'Remote',
    jobType: jobType || 'Full-time',
    experienceLevel: experienceLevel || 'Mid Level',
    category: category || 'Software Engineering',
    salaryMin: Number(salaryMin) || 80000,
    salaryMax: Number(salaryMax) || 120000,
    salaryCurrency,
    featured: Boolean(featured),
    postedDate: new Date().toISOString(),
    status: 'active',
    employerId,
    description,
    requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split('\n').filter(Boolean) : []),
    responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split('\n').filter(Boolean) : []),
    benefits: Array.isArray(benefits) ? benefits : (benefits ? benefits.split('\n').filter(Boolean) : []),
    applicantsCount: 0
  };

  data.jobs.unshift(newJob);
  db.save(data);

  res.status(201).json(newJob);
});

// PUT update existing job
router.put('/:id', (req, res) => {
  const data = db.get();
  const index = data.jobs.findIndex(j => j.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Job not found' });
  }

  const existing = data.jobs[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id,
    employerId: existing.employerId,
    postedDate: existing.postedDate
  };

  data.jobs[index] = updated;
  db.save(data);

  res.json(updated);
});

// DELETE job
router.delete('/:id', (req, res) => {
  const data = db.get();
  const initialLen = data.jobs.length;
  data.jobs = data.jobs.filter(j => j.id !== req.params.id);

  if (data.jobs.length === initialLen) {
    return res.status(404).json({ error: 'Job not found' });
  }

  // Also remove associated applications
  data.applications = (data.applications || []).filter(a => a.jobId !== req.params.id);
  // Also remove bookmarks
  data.bookmarks = (data.bookmarks || []).filter(b => b.jobId !== req.params.id);

  db.save(data);
  res.json({ success: true, message: 'Job deleted successfully' });
});

export default router;
