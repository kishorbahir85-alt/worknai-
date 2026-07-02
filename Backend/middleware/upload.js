import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary, { ensureCloudinaryConfigured } from '../config/cloudinary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const resumeDir = path.join(__dirname, '../uploads/resumes');
const coverLetterDir = path.join(__dirname, '../uploads/coverletters');
if (!fs.existsSync(resumeDir)) fs.mkdirSync(resumeDir, { recursive: true });
if (!fs.existsSync(coverLetterDir)) fs.mkdirSync(coverLetterDir, { recursive: true });

const applicationStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'coverLetterFile') cb(null, coverLetterDir);
    else cb(null, resumeDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const prefix = file.fieldname === 'coverLetterFile' ? 'cl' : 'resume';
    const ownerId = req.user?._id || Math.round(Math.random() * 1e9);
    cb(null, `${prefix}_${ownerId}_${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only PDF, DOC, DOCX files are allowed'));
};

export const uploadResume = multer({
  storage: applicationStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const IMAGE_EXT = ['.png', '.jpg', '.jpeg', '.webp', '.svg'];
const VIDEO_EXT = ['.mp4', '.mov', '.webm', '.mkv'];

const FOLDER_BY_FIELD = {
  logo: 'worknai/products/logos',
  gallery: 'worknai/products/gallery',
  heroImage: 'worknai/products/hero',
  heroVideo: 'worknai/products/hero',
  overviewImage: 'worknai/products/overview',
  benefitsImage: 'worknai/products/benefits',
};

const coverImageFolder = (req) => {
  if (req.baseUrl.includes('tutorials')) return 'worknai/tutorials/covers';
  if (req.baseUrl.includes('blog')) return 'worknai/blog/covers';
  return 'worknai/covers';
};

const productStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    ensureCloudinaryConfigured();
    const ext = path.extname(file.originalname).toLowerCase();
    const isVideo = file.fieldname === 'heroVideo' || VIDEO_EXT.includes(ext);
    const folder = file.fieldname === 'coverImage' ? coverImageFolder(req) : (FOLDER_BY_FIELD[file.fieldname] || 'worknai/products/misc');
    return {
      folder,
      resource_type: isVideo ? 'video' : 'image',
      public_id: `${file.fieldname}_${req.user._id}_${Date.now()}_${Math.round(Math.random() * 1e9)}`,
    };
  },
});

const productFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.fieldname === 'heroVideo') {
    if (VIDEO_EXT.includes(ext)) return cb(null, true);
    return cb(new Error('Only MP4, MOV, WEBM or MKV videos are allowed'));
  }
  if (IMAGE_EXT.includes(ext)) return cb(null, true);
  cb(new Error('Only PNG, JPG, WEBP or SVG images are allowed'));
};

export const uploadProductImages = multer({
  storage: productStorage,
  fileFilter: productFileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
}).fields([
  { name: 'logo', maxCount: 1 },
  { name: 'gallery', maxCount: 8 },
  { name: 'heroImage', maxCount: 1 },
  { name: 'heroVideo', maxCount: 1 },
  { name: 'overviewImage', maxCount: 1 },
  { name: 'benefitsImage', maxCount: 1 },
]);

const coverImageFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (IMAGE_EXT.includes(ext)) return cb(null, true);
  cb(new Error('Only PNG, JPG, WEBP or SVG images are allowed'));
};

export const uploadBlogImages = multer({
  storage: productStorage,
  fileFilter: coverImageFileFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
}).fields([{ name: 'coverImage', maxCount: 1 }]);

export const uploadTutorialImages = multer({
  storage: productStorage,
  fileFilter: coverImageFileFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
}).fields([{ name: 'coverImage', maxCount: 1 }]);
