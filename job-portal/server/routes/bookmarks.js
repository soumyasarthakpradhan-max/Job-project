import express from 'express';
import crypto from 'crypto';
import { db } from '../db.js';

const router = express.Router();

// GET all saved jobs for a user
router.get('/:userId', (req, res) => {
  const data = db.get();
  const userBookmarks = (data.bookmarks || []).filter(b => b.userId === req.params.userId);

  const savedJobs = userBookmarks.map(b => {
    const job = (data.jobs || []).find(j => j.id === b.jobId);
    return {
      bookmarkId: b.id,
      savedAt: b.savedAt,
      job
    };
  }).filter(b => b.job !== undefined);

  res.json(savedJobs);
});

// POST save a job
router.post('/', (req, res) => {
  const { userId, jobId } = req.body;
  if (!userId || !jobId) {
    return res.status(400).json({ error: 'userId and jobId are required' });
  }

  const data = db.get();
  if (!data.bookmarks) data.bookmarks = [];

  const existing = data.bookmarks.find(b => b.userId === userId && b.jobId === jobId);
  if (existing) {
    return res.json({ message: 'Already bookmarked', bookmark: existing });
  }

  const newBookmark = {
    id: `bm-${crypto.randomUUID().slice(0, 8)}`,
    userId,
    jobId,
    savedAt: new Date().toISOString()
  };

  data.bookmarks.push(newBookmark);
  db.save(data);

  res.status(201).json({ message: 'Job bookmarked successfully', bookmark: newBookmark });
});

// DELETE remove a bookmark
router.delete('/:userId/:jobId', (req, res) => {
  const { userId, jobId } = req.params;
  const data = db.get();

  const prevLen = (data.bookmarks || []).length;
  data.bookmarks = (data.bookmarks || []).filter(b => !(b.userId === userId && b.jobId === jobId));

  db.save(data);
  res.json({ success: true, removed: (data.bookmarks || []).length < prevLen });
});

export default router;
