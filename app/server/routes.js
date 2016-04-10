module.exports = function(app) {
	app.get('/', function (req, res) {
		var wrong = "";
		if(req.session.login == 1) {
			res.redirect('/home');
			res.end();
		}
		req.session.login = 0;
		if(req.session.wrong != null){
			wrong = req.session.wrong;
			req.session.wrong = null;
		}
		res.render('index', {title: 'Main Page', wrong: wrong});
	});
	app.post('/', function(req, res) {
		var dbconnect = require('./db/connect.js');
		var id = req.body['id'];
		var pass = req.body['pass'];
		console.log(`ID : ${id} pass: ${pass}`);
		dbconnect('select id, pass from users where id = "'+ id +'" and pass = "'+pass+'" limit 1;', function(err, rows){
			if(err) {
				console.log('Error while querying '+err);
			} else {

				if(!rows[0]){
					req.session.wrong = "Wrong Username OR Password";
					res.redirect('/');
					res.end();
				} else {
					if(rows[0].id === id) {
						req.session.username = id;
						req.session.login = 1;
						console.log("At / post " + req.session.login);
						req.session.wrong = null;
						res.redirect('/home');
						res.end();
					} else {
						req.session.wrong = "NO matching";
						res.redirect('/');
						res.end();
					}
				}
			}
		});
	});
	app.get('/home', function(req, res) {
		if( req.session.username == null || req.session.login == 0){
			req.session.wrong = "You are Logged Out.";
			res.redirect('/');
			res.end();
		} else {
			var id;
			console.log("At home " + req.session.login);
			if(req.session.login == 1){
				res.render('home', {title: "Home", id: req.session.username});
			} else {
				req.session.wrong = "Please Login.";
				res.redirect('/');
				res.end();
			}
		}
	});
	app.get('/logout', function(req, res) {
		console.log("At logout : "+ req.session.login);
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
		res.end();
	});
}