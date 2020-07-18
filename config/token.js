const jwt = require('jsonwebtoken');
const tokenkey = 'testing@#123';

function getToken(param) {
	let token = jwt.sign({
		username: param.username,
  		iat : (+ new Date())/1000,
  		exp : ((+ new Date())/1000) + 604800  	
  	}, tokenkey);

  	return token;
}

function checkToken(req, res, next) {

	let token = req.headers['auth-token'];

    if (token) {
        jwt.verify(token, tokenkey, (err, decoded) => {
            if (err) {
            	res.status(401).json({
            		status: false,
            		msg: 'Invalid Token'
            	});
            } else {
            	req.user = {};
                req.user.decodedToken = decoded;
                req.user.username = decoded.email;
                next();
            }
        });
    } else {
    	res.status(401).json({
    		status: false,
    		msg: 'Token is required.'
    	});
    }
}

module.exports = {
    getToken,
    checkToken
}