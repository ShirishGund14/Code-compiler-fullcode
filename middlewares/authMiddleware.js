const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {
    try {
        //get token from header
    
        // const token = req.header('authorization').replace("Bearer ","");
        const token = req.header('authorization')?.replace("Bearer ", "");

        
        //   //save token to localStorage
        // localStorage.setItem('token', token);

        const decryptedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        req.body.userId = decryptedToken.userId;
        next();

    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
}