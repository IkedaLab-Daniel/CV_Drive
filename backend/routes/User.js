const express = require('express')
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// controller functions
const {
    loginUser,
    singupUser,
    updateUser,
    updateProfileImage
} = require('../controllers/userController')

const router = express.Router()
const uploadDirectory = path.resolve(__dirname, '../public/images');
fs.mkdirSync(uploadDirectory, { recursive: true });

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', singupUser)

// update route
router.patch('/:id', updateUser)

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// update PROFILE route
router.patch('/profile/:id', upload.single('profileImage'), updateProfileImage)




module.exports = router