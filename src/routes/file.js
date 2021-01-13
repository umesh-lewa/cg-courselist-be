var express = require('express');
var router = express.Router();

const multer = require('multer');
const path = require('path');

const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const s3 = new aws.S3();

aws.config.update({
    secretAccessKey: "AKIAJAXL4KKUGRQD4XWA",
    accessKeyId: "o6XvbbKBT+7eWUtMZ0q9QT/DnUwPCcYdSVyneQfY",
    region: "us-east-1",
});

const fileFilter = (req, file, cb) => {
    if (file) {
        //console.log(file)
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    fileFilter,
    storage: multerS3({
        acl: "public-read",
        s3,
        bucket: 'cg-courselist',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: "TESTING_DigiPrex" });
        },
        key: function (req, file, cb) {
            const name = file.originalname.split(".")[0]
            cb(null, name + "-" + Date.now() + path.extname(file.originalname));
        },
    }),
});



//const upload = multer({ storage: storage, fileFilter: fileFilter});

//Upload route
router.post('/upload', upload.array('files'), async (req, res, next) => {


    try {

        let files = req.files

        res.status(201).json({
            message: 'File uploded successfully',

        });
    } catch (error) {

        console.error(error);
    }
});

module.exports = router;