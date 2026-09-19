const express = require('express');
const fs = require('fs');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadResume, getResumes, deleteResume } = require('../controllers/resumeController');
const requireAuth = require('../middleware/requireAuth')

// Multer setup
const uploadDirectory = path.resolve(__dirname, '../public/images');
fs.mkdirSync(uploadDirectory, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const uploadPath = path.resolve(__dirname, '../public/images', file.originalname);

    // Check if file already exists
    fs.access(uploadPath, fs.constants.F_OK, (err) => {
      if (err) {
        // File does not exist, use original name
        cb(null, file.originalname);
      } else {
        // File exists, handle the conflict (e.g., add a timestamp to the name)
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        cb(null, `${baseName}_${timestamp}${ext}`);
      }
    });
  },
});

const upload = multer({ storage });

// require auth for all resume routes
router.use(requireAuth)

// Routes
router.post('/upload', upload.single('file'), uploadResume);
router.get('/getResumes', getResumes);
router.delete('/delete/:id', deleteResume)

// Serve files for download
router.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.resolve(__dirname, '../public/images', filename);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File does not exist:', filePath);
      return res.status(404).json({ error: 'File not found' });
    }

    // Send the file for download
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).json({ error: 'Could not download the file' });
      }
    });
  });
});


module.exports = router;
