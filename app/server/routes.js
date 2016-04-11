module.exports = function(app) {
	app.get('/', function (req, res) {
		// if home page then check if logged in then redirect to home page if not then render index page
		var wrong = "";
		if(req.session.login == 1) {
			res.redirect('/home');
		}
		req.session.login = 0;
		if(req.session.wrong != null){
			wrong = req.session.wrong;
			req.session.wrong = null;
		}
		res.render('index', {title: 'Main Page', wrong: wrong});
	});
	app.post('/', function(req, res) {
		// came after when username and password is send as post data.
		var dbconnect = require('./db/connect.js');
		var id = req.body['id'];
		var pass = req.body['pass'];
		dbconnect('select id, pass from users where id = "'+ id +'" and pass = "'+pass+'" limit 1;', function(err, rows){
			if(err) {
				console.log('Error while querying '+err);
			} else {

				if(!rows[0]){
					req.session.wrong = "Wrong Username OR Password";
					res.redirect('/');
				} else {
					if(rows[0].id === id) {
						req.session.username = id;
						req.session.login = 1;
						req.session.wrong = null;
						res.redirect('/home');
					} else {
						req.session.wrong = "NO matching";
						res.redirect('/');
					}
				}
			}
		});
	});
	app.get('/home', function(req, res) {
		if( req.session.username == null || req.session.login == 0){
			req.session.wrong = "You are Logged Out.";
			res.redirect('/');
		} else {
			var id;
			if(req.session.login == 1){
				res.render('home', {title: "Home", id: req.session.username});
			} else {
				req.session.wrong = "Please Login.";
				res.redirect('/');
			}
		}
	});
	app.get('/logout', function(req, res) {
		if(req.session.login == null){
			req.session.login = 0;
		} else {
			if(req.session.login == 1){
				req.session.login = 0;
			} else {

			}
		}
		
		// res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
		// res.header('Expires', '-1');
		// res.header('Pragma', 'no-cache');
		// res.setHeader("location", "/");
		// res.end();
		res.redirect(302, '/');
	});
}