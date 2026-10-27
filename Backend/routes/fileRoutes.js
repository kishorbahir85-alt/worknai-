import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve private applicant files — resumes and cover letters
// Only authenticated Admin / Manager / HR can access these
router.get('/resumes/:filename', protect, authorize('admin', 'manager', 'hr'), (req, res) => {
  const filename = path.basename(req.params.filename); // prevent path traversal
  const filePath = path.join(__dirname, '../uploads/resumes', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  res.sendFile(filePath);
});

router.get('/coverletters/:filename', protect, authorize('admin', 'manager', 'hr'), (req, res) => {
  const filename = path.basename(req.params.filename); // prevent path traversal
  const filePath = path.join(__dirname, '../uploads/coverletters', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  res.sendFile(filePath);
});

export default router;
