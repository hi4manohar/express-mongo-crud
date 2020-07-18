var express = require('express');
var router = express.Router();
const { users } = require('../config/fakebackend');
const { getToken, checkToken } = require('../config/token');
const { agencyvalidate } = require('../middleware/validate');
const { validationResult } = require('express-validator');
const { dbins } = require('../config/db');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/get-token', function(req, res, next) {

	if( req.body.username && req.body.password ) {

		let param = {};
		param.username = req.body.username.trim();
		param.password = req.body.password.trim();

		let authstatus = false;

		for( let user in users ) {
			if( users[user].username === param.username && users[user].password === param.password ) {
				authstatus = true;
				break;
			}
		}

		if( authstatus === false ) {
			res.status(401).json({
				status: false,
				msg: 'Invalid Username and Password.'
			})
		} else {

			let authtoken = getToken(param);
			res.status(200).json({
				status: true,
				authtoken: authtoken
			});
		}

	} else {
		res.status(406).json({
			status: false,
			msg: 'Username and Password is Required.'
		})
	}

})

router.post('/create-agency', checkToken, agencyvalidate('agency'), async function(req, res, next) {

	// Finds the validation errors in this request and wraps them in an object with handy functions
	const errors = validationResult(req); 
	if (!errors.isEmpty()) {
		res.status(422).json({ status: false, errors: errors.array() });
		return;
	}

	let db = await dbins();

	//insert to agency collection
	db.collection('agency').insertOne(req.body.agency).then(result => {

		res.status(200).json({
			status: true,
			msg: 'Agency has been created.',
			insertId: result.insertedId
		})
	}).catch(error => {
		console.error(error);

		if( error.code === 11000 ) {

			res.status(406).json({
				status: false,
				msg: 'Client id is not unique'
			})

		} else {

			res.status(500).json({
				status: false,
				msg: 'Something went wrong.'
			})
		}
	})	
})

router.post('/get-agency-client', checkToken, async function(req, res, next) {
	let db = await dbins();

	db.collection('agency').aggregate([
		{$unwind: "$clients"},
		{$project: {
			"name": 1, 
			"clients.cname": 1,
			"client_id": 1,
			"total_bill" : {"$max" : "$clients.total_bill"}
		}},
		{$sort:{"total_bill":-1}},
	]).toArray().then(result => {

		res.json({
			status: true,
			data: result
		})
	}).catch(error => {
		console.log(error);
	})
})


router.post('/update-client', checkToken, agencyvalidate('client'), async(req, res, next) => {

	const errors = validationResult(req); 
	if (!errors.isEmpty()) {
		res.status(422).json({ status: false, errors: errors.array() });
		return;
	}

	let db = await dbins();

	db.collection('agency').update({
		"clients.client_id": req.body.client_id
	},{
		$set:{
			"clients.$.cname": req.body.cname,
			"clients.$.email": req.body.email,
			"clients.$.phone": req.body.phone,
			"clients.$.total_bill": req.body.total_bill
		}
	}).then(result => {

		if( result.nModified > 0 ) {
			res.status(200).json({
				status: true,
				msg: 'Info Updated'
			})
		} else {
			res.status(406).json({
				status: false,
				msg: 'Invalid Client Id'
			})
		}

	}).catch(error => {

		console.log(error);
		res.status(500).json({
			status: false,
			msg: 'Something went wrong'
		})
	})

})

module.exports = router;
