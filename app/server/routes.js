module.exports = function(app) {
	app.get('/', function (req, res) {
		res.render('index', {title: 'Main Page'});
	});
	app.post('/', function(req, res) {
		
	});
}