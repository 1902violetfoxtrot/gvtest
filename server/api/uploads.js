const path = require("path");
const multer = require("multer");
const vision = require("@google-cloud/vision");
const router = require("express").Router();
const Label = require("../db/models/label");
const Locations = require("../db/models/");
const redis = require("redis");
const redisClient = redis.createClient();
const { Op } = "Sequelize";

module.exports = router;

redisClient.on("error", function (err) {
  console.log("Error " + err);
});

async function quickstart(aFile) {
  // Imports the Google Cloud client library

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: "./API.json"
  });

  let labels = await Label.findAll();

  redisClient.set("labels", JSON.stringify(labels), redis.print);
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

  // let setArray = Array.from(labelz);
  redisClient.get("labels", function(err, reply) {
    if (reply) console.log(reply)
    else console.error(err)
  });
}

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, path.join(__dirname, "..", "../public/uploads/"));
  },
  filename: function(req, file, callback) {
    console.log(file);
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

const upload = multer({ storage: storage }).array("files");

router.post("/", async (req, res) => {
  upload(req, res, err => {
    if (err) {
      console.error("Failed to upload file");
    } else {
      res.sendStatus(200);
      req.files.forEach(file => {
        quickstart(file.path);
      });
    }
  });
  // try {
  //   const labelMatchQuery = await Label.findAll({where: {
  //     name: {
  //       [Op.or]: setArray
  //     }
  //   }})
  // } catch (error) {
  //   console.error(error)
  // }
});
