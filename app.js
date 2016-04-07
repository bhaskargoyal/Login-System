var express = require('express');
var http = require('http');
var routes = require('./app/server/routes');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/app/server/views');
app.set('view engine', 'jade');

app.all('/*', function(req, res, next) {
	console.log('request for '+req.url +' '+ req.method);
	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.cookieParser());
app.use(session({
	secret : 'my-secret',
	resave: true,
	saveUninitialized: false,
}));
app.use(express.static(__dirname + '/app/public'));
routes(app);

http.createServer(app).listen(app.get('port'), function() {
	console.log("Server running on port "+ app.get('port'));
});