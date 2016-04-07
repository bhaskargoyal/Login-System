var express = require('express');
var http = require('http');
var routes = require('./app/server/routes');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/app/server/views');
app.set('view engine', 'jade');

app.all('/*', function(req, res, next) {
	console.log('request for '+req.url);
	next();
});
app.use(express.static(__dirname + '/app/public'));
routes(app);

http.createServer(app).listen(app.get('port'), function() {
	console.log("Server running on port "+ app.get('port'));
});