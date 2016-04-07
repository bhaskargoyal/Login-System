var mysql = require('mysql');
var dbconfig = require('./dbconfig');

module.exports = function (query, callback) {
	var error = "";
	var connection = mysql.createConnection(dbconfig);
	connection.connect( function(err) {
		if(err){
			error = err;
			console.log("Error connecting db "+ err);
		} else {
			callQuery(connection, query, callback);
		}
	});

};

function callQuery(connection, query, callback){
	connection.query(query, function(err, rows, fields) {
		callback(err, rows);
	});
}