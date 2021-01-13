var jwt = require("jsonwebtoken");

var authenticate = function (req, res, next) {

    if (req.headers.authorization) {

        jwt.verify(req.headers.authorization, process.env.Secret, function (err, decode) {

            if (err) {
                res.json({
                    "stat": "500",
                    "message": "Token not valid",
                })
            }
            next();
        });

    } else {
        res.json({
            "stat": "500",
            "message": "Token not present",
        });
    }
}

module.exports = { authenticate };