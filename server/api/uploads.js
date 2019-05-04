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
  destination: function(req, file, callback) {
    callback(null, path.join(__dirname, '..', '../public/uploads/'));
  },
  filename: function(req, file, callback) {
    console.log(file);
    callback(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  }
});

const upload = multer({ storage: storage }).single('file');

router.post('/', (req, res) => {
  upload(req, res, err => {
    if (err) {
      console.error('Failed to upload file');
    } else {
      res.sendStatus(200);
      quickstart(req.file.path);
    }
  });
});
