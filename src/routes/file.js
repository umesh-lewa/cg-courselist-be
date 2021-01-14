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
            cb(null, { fieldName: "TESTING_Cg_Courselist" });
        },
        key: function (req, file, cb) {
            const name = file.originalname.split(".")[0]
            cb(null, name + "-" + Date.now() + path.extname(file.originalname));
        },
    }),
});

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "hwr4wkxs079mtb19.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "d98xthx8poc64jy3",
    password: "lmalu9tjd0d4y13o",
    database: "xpmpzb871xctqyfk"
});

//const upload = multer({ storage: storage, fileFilter: fileFilter});

//Upload route
router.post('/upload', upload.array('files', 1), async (req, res, next) => {

    console.log("Uploaded File");

    try {

        let files = req.files

        res.status(201).json({
            message: 'File uploded successfully',

        });
    } catch (error) {

        console.error(error);
    }
});

router.post('/uploadDetails', async (req, res, next) => {

    try {

        let author = req.body.AuthorName;
        let description = req.body.Description;
        let courseKey = req.body.CourseKey;

        var sql = "INSERT INTO courses (AUTHOR, DESCRIPTION, NAME) VALUES ('" + author + "', '" + description + "', '" + courseKey + "')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
            res.json({
                "stat": "200",
                "message": "Successfully inserted Course Details"
            });
        });

    } catch (error) {
        console.error(error);
        res.json({
            "stat": "500",
            "message": 'Error in inserting course details',

        });
    }

});

router.delete('/deleteDetails', async (req, res, next) => {

    try {

        let coursename = req.body.CourseName;

        var sql = "DELETE FROM courses WHERE NAME = '" + coursename + "'";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record deleted");
            res.json({
                "stat": "200",
                "message": "Successfully deleted Course Details"
            });
        });

    } catch (error) {
        console.error(error);
        res.json({
            "stat": "500",
            "message": 'Error in deleting course details',

        });
    }
});

router.get('/all', async (req, res, next) => {

    try {

        let author = req.body.AuthorName;
        let description = req.body.Description;
        let courseKey = req.body.CourseKey;

        var sql = "SELECT * FROM courses";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
            res.json({
                "stat": "200",
                "message": "Successfully fetched Course Details",
                "result": result
            });
        });

    } catch (error) {
        console.error(error);
        res.json({
            "stat": "500",
            "message": 'Error in fetching course details',
        });
    }

});

router.post('/addComment', async (req, res, next) => {

    try {

        let coursename = req.body.CourseName;
        let comment = req.body.Comment;

        let prevComments = "";
        let newComments = "";

        var sql = "SELECT COMMENTS FROM courses WHERE NAME = '" + coursename + "'";
        con.query(sql, function (err, result) {
            if (err) throw err;

            console.log("result : " + JSON.stringify(result));
            prevComments = result[0].COMMENTS;
            console.log("prevComments : "+prevComments);
            newComments = prevComments + comment + "-";
            console.log("newComments : "+newComments);

            var sql1 = "UPDATE courses SET COMMENTS = '"+newComments+"' WHERE NAME = '"+coursename+"'";
            con.query(sql1, function (err, result) {
                if (err) throw err;
                console.log(result.affectedRows + " record(s) updated");
            });

            res.json({
                "stat": "200",
                "message": "Successfully added new comment",
                "result": result
            });
        });

    } catch (error) {
        console.error(error);
        res.json({
            "stat": "500",
            "message": 'Error in adding new comment',

        });
    }

});


router.get('/getComments/:CourseName', async (req, res, next) => {

    try {

        let coursename = req.params.CourseName;

        var sql = "SELECT COMMENTS FROM courses WHERE NAME = '"+coursename+"'";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("result : "+result);
            res.json({
                "stat": "200",
                "message": "Successfully fetched comment Details",
                "result": result
            });
        });

    } catch (error) {
        console.error(error);
        res.json({
            "stat": "500",
            "message": 'Error in fetching comment details',
        });
    }

});


module.exports = router;