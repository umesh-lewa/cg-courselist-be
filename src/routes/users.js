var express = require('express');
var router = express.Router();

const { SECRET_KEY } = require('../../config');

var mysql = require('mysql'); 


var con = mysql.createConnection({
  host: "hwr4wkxs079mtb19.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  user: "d98xthx8poc64jy3",
  password: "lmalu9tjd0d4y13o",
  database: "xpmpzb871xctqyfk"
});


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('hello from users');
});


/*------------------------------------------ Login ---------------------------*/
router.post('/login', async function (req, res, next) {

  const email = req.body.email;
  const password = req.body.password;

  try {


      
      con.query('SELECT * FROM user WHERE EMAILID = '+'"'+email+'"', function (err, result, fields) {
        if (err) throw err;
        console.log(result);

        if(result.length == 0){
          //con.end();
          return res.json({
            "stat": "failure",
            "message": "User does not exist"
          });

        }
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
  }

});

module.exports = router;