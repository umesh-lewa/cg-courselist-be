var express = require('express');
var router = express.Router();

var mysql = require('mysql'); 

var con = mysql.createConnection({
  host: "hwr4wkxs079mtb19.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  user: "d98xthx8poc64jy3",
  password: "lmalu9tjd0d4y13o",
  database: "xpmpzb871xctqyfk"
});

/*
con.connect(function(err) {
  if (err) throw err;

  console.log("JawsDB Connected!");
});
*/

/* GET admin listing. */
router.get('/', function (req, res, next) {
    res.send('hello from admin');
});

/*------------------------------------------ Login ---------------------------*/
router.post('/login', async function (req, res, next) {

    const email = req.body.email;
    const password = req.body.password;
  
    try {

        con.query('SELECT * FROM admin WHERE EMAILID = '+'"'+email+'"', function (err, result, fields) {
            console.log('SELECT * FROM admin WHERE EMAIL = '+'"'+email+'"');
          if (err) throw err;
          console.log(result);
          if(result.length == 0){
            //con.end();
            return res.json({
              "stat": "failure",
              "message": "User does not exist"
            });
          }
          console.log(result[0].PASSWORD);
          if(result[0].PASSWORD == password){
            //con.end();
            return res.json({
              "stat": "200",
              "message": "Login Success"
            });
          }else{
            //con.end();
            return res.json({
              "stat": "failure",
              "message": "Wrong password"
            });
          }
        });

      
  
    } catch (err) {
      console.log(err);
      //con.end();
      res.json({
        "stat": "500",
        "message": "Error in Logging In User"
      });
    } finally{
      //con.end();
    }
  
});

module.exports = router;