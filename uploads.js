const path = require('path');
const multer = require('multer');
const vision = require('@google-cloud/vision');
const router = require('express').Router();
module.exports = router;

async function quickstart(aFile) {
  // Imports the Google Cloud client library

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: './API.json'
  });

  // Performs label detection on the image file
  const [result] = await client.labelDetection(aFile);
  const labels = result.labelAnnotations;
  console.log('Labels:');
  labels.forEach(label => console.log(label.description));
}

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb) {
    cb(null, 'IMAGE-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }
});

router.post('/upload', upload.single('myImage'), (req, res, next) => {
  try {
    console.log('Request ---', req.body);
    console.log('Request file ---', req.file);
    quickstart(req.file[0]);
  } catch (error) {
    next(error);
  }
});
