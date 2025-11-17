import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import  {createEvent,getEvents}  from '../controllers/eventController.js';

const router = express.Router();

// configure multer for file uploads
const uploadPath = path.resolve('uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
  console.log('Created uploads directory');
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// handle multipart/form-data with multiple banners
router.post('/create', upload.array('banners', 10), createEvent);

router.get('/',getEvents)

export default router;
