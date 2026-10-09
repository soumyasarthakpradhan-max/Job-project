import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { db } from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer storage config for resume uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// POST submit a job application (handles both JSON and multipart form data)
router.post('/', upload.single('resumeFile'), (req, res) => {
  try {
    const {
      jobId,
      candidateId = 'user-cand-1',
      candidateName,
      candidateEmail,
      candidatePhone,
      candidateHeadline,
      coverNote,
      portfolioUrl,
      resumeUrl
    } = req.body;

    if (!jobId || !candidateName || !candidateEmail) {
      return res.status(400).json({ error: 'Job ID, name, and email are required' });
    }

    const data = db.get();
    const job = data.jobs.find(j => j.id === jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if candidate already applied to this job
    const existing = (data.applications || []).find(
      a => a.jobId === jobId && (a.candidateId === candidateId || a.candidateEmail.toLowerCase() === candidateEmail.toLowerCase())
    );

    if (existing) {
      return res.status(400).json({ error: 'You have already submitted an application for this position' });
    }

    let fileUrl = resumeUrl || '';
    let fileName = '';

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileName = req.file.originalname;
    }

    const newApplication = {
      id: `app-${crypto.randomUUID().slice(0, 8)}`,
      jobId,
      candidateId,
      candidateName,
      candidateEmail,
      candidatePhone: candidatePhone || '',
      candidateHeadline: candidateHeadline || '',
      resumeFileName: fileName || 'Resume_Submitted.pdf',
      resumeUrl: fileUrl || 'https://example.com/resumes/resume.pdf',
      coverNote: coverNote || '',
      portfolioUrl: portfolioUrl || '',
      status: 'Applied',
      appliedDate: new Date().toISOString(),
      notes: ''
    };

    if (!data.applications) {
      data.applications = [];
    }
    data.applications.unshift(newApplication);

    // Increment applicantsCount on job
    job.applicantsCount = (job.applicantsCount || 0) + 1;

    db.save(data);

    res.status(201).json({
      message: 'Application submitted successfully',
      application: newApplication
    });
  } catch (err) {
    console.error('Error submitting application:', err);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// GET applications for a specific candidate
router.get('/candidate/:candidateId', (req, res) => {
  const data = db.get();
  const candidateApps = (data.applications || []).filter(a => a.candidateId === req.params.candidateId);

  // Attach job info to each application
  const enriched = candidateApps.map(app => {
    const job = data.jobs.find(j => j.id === app.jobId);
    return {
      ...app,
      job: job ? {
        id: job.id,
        title: job.title,
        company: job.company,
        companyLogo: job.companyLogo,
        location: job.location,
        workplaceType: job.workplaceType,
        jobType: job.jobType,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryCurrency: job.salaryCurrency
      } : null
    };
  });

  res.json(enriched);
});

// GET applications for a specific job (recruiter view)
router.get('/job/:jobId', (req, res) => {
  const data = db.get();
  const jobApps = (data.applications || []).filter(a => a.jobId === req.params.jobId);
  res.json(jobApps);
});

// GET all applications for an employer
router.get('/employer/:employerId', (req, res) => {
  const data = db.get();
  const employerJobs = data.jobs.filter(j => j.employerId === req.params.employerId);
  const employerJobIds = new Set(employerJobs.map(j => j.id));

  const apps = (data.applications || []).filter(a => employerJobIds.has(a.jobId));
  const enriched = apps.map(app => {
    const job = employerJobs.find(j => j.id === app.jobId);
    return {
      ...app,
      jobTitle: job ? job.title : 'Unknown Position',
      company: job ? job.company : ''
    };
  });

  res.json(enriched);
});

// PATCH update application status and recruiter notes
router.patch('/:id/status', (req, res) => {
  const { status, notes } = req.body;
  const data = db.get();

  const app = (data.applications || []).find(a => a.id === req.params.id);
  if (!app) {
    return res.status(404).json({ error: 'Application not found' });
  }

  if (status) {
    const validStatuses = ['Applied', 'Reviewing', 'Interview', 'Offer', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }
    app.status = status;
  }

  if (notes !== undefined) {
    app.notes = notes;
  }

  db.save(data);
  res.json(app);
});

// DELETE withdraw application
router.delete('/:id', (req, res) => {
  const data = db.get();
  const appIndex = (data.applications || []).findIndex(a => a.id === req.params.id);

  if (appIndex === -1) {
    return res.status(404).json({ error: 'Application not found' });
  }

  const [removed] = data.applications.splice(appIndex, 1);

  // Decrement job applicant count
  const job = data.jobs.find(j => j.id === removed.jobId);
  if (job && job.applicantsCount > 0) {
    job.applicantsCount -= 1;
  }

  db.save(data);
  res.json({ success: true, message: 'Application withdrawn successfully' });
});

export default router;
