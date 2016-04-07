module.exports = function(app) {
	app.get('/', function (req, res) {
		var wrong = "";
		req.session.login = "0";
		if(req.session.wrong){
			wrong = req.session.wrong;
		}
		res.render('index', {title: 'Main Page', wrong: wrong});
	});
	app.post('/', function(req, res) {
		var dbconnect = require('./db/connect.js');
		var id = req.body.id;
		var pass = req.body.pass;
		console.log(`ID : ${id} pass: ${pass}`);
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
			req.session.wrong = "Unauthorized access not allowed.";
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
		if(req.session.login == 1){
			req.session.login =0;
		}
		res.redirect('/');
	});
}