const path = require('path');
const multer = require('multer');
const vision = require('@google-cloud/vision');
const router = require('express').Router();
const Label = require('../db/models/label');
const Locations = require('../db/models/location');

module.exports = router;

const labels = [
  { name: 'urban' }, // 0
  { name: 'arctic' },
  { name: 'beach' },
  { name: 'mountain' },
  { name: 'park' },
  { name: 'forest' }, // 5
  { name: 'plain' },
  { name: 'desert' },
  { name: 'historical' },
  { name: 'ocean' },
  { name: 'festival' }, // 10
  { name: 'tropical' },
  { name: 'architecture' },
  { name: 'nature' },
  { name: 'cruise' },
  { name: 'canyon' }, // 15
  { name: 'geyser' },
  { name: 'volcano' },
  { name: 'museum' },
  { name: 'cathedral' },
  { name: 'amusement park' }, // 20
  { name: 'indoors' },

  { name: 'outdoors' },
  { name: 'resort' },
  { name: 'camp' },
  { name: 'restaurant' }, // 25
  { name: 'orchard' },
  { name: 'valley' },
  { name: 'temple' },
  { name: 'lake' },
  { name: 'waterfall' }, // 30
  { name: 'lighthouse' },
  { name: 'statue' },
  { name: 'memorial' },
  { name: 'road' },
  { name: 'island' }, // 35
  { name: 'animals' },
  { name: 'flowers' },
  { name: 'aquarium' },
  { name: 'casino' }, // 39
];

async function quickstart(aFile) {
  // Imports the Google Cloud client library

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: './API.json',
  });

  // Performs label detection on the image file
  const labelz = new Set([]);
  const [result] = await client.labelDetection(aFile);
  result.labelAnnotations.forEach(label => {
    labels.forEach(labelEl => {
      let foundLabel = label.description.toLowerCase();
      if (foundLabel.includes(labelEl.name)) {
        labelz.add(labelEl.name);
      }
    });
  });
  console.log(labelz);
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
  },
});

const upload = multer({ storage: storage }).array('files');

router.post('/', (req, res) => {
  upload(req, res, err => {
    if (err) {
      console.error('Failed to upload file');
    } else {
      res.sendStatus(200);
      req.files.forEach(file => {
        quickstart(file.path);
      });
    }
  });
});
