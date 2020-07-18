const MongoClient = require('mongodb').MongoClient;
const connstring = '';

function dbins() {

	return new Promise((resolve, reject) => {

		//provide your mongo connection string
		MongoClient.connect(connstring, (err, client) => {
			if (err) {
				console.error(err);
				throw err;
			} 
			console.log('Connected to Database');
			db = client.db('agency');

			resolve(db);
		})
	})
}

module.exports = {
	dbins
}
