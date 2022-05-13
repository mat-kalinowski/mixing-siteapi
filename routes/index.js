var express = require('express');
var cors = require('cors')
const AWS = require('aws-sdk')

var router = express.Router();
router.use(cors())

AWS.config.update({ 
  accessKeyId: 'aci',
  secretAccessKey: 'sak',
  region: 'eu-central-1',
  signatureVersion: 'v4'
});

const s3 = new AWS.S3()
const myBucket = 'mixing-samples';
const myKey = 'destination/key.jpg';
const signedUrlExpireSeconds = 60 * 5;

/* GET home page. */
router.get('/', function(req, res, next) {
  const str = process.env.SAK;
  res.render('index', { title: `SAK: ${str}` });
});

router.post('/s3-url', function(req, res, next) {
  const url = s3.getSignedUrl('putObject', {
    Bucket: myBucket,
    Key: req.body.name,
    Expires: signedUrlExpireSeconds
  });
  console.log();
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.send({ "s3-url": url });
});

router.post('/s3-url', async function(req, res, next) {
  var token = req.body.token;
  const secretKey = "banana";
  const response =
      fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
      {
        method: 'POST'
      });
  const data = await response.json();

  console.log("captcha tried");
  console.log(data);

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
});

module.exports = router;
