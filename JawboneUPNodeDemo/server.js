var express = require('express'),
	app = express(),
	ejs = require('ejs'),
	https = require('https'),
	fs = require('fs'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	JawboneStrategy = require('passport-oauth').OAuth2Strategy,
	port = 6000,
	jawboneAuth = {
       clientID: 'VcbiJETBEjY',
       clientSecret: 'e9501d3e5dce223d3a71d7b44fcd57a0cc5e0305',
       authorizationURL: 'https://jawbone.com/auth/oauth2/auth',
       tokenURL: 'https://jawbone.com/auth/oauth2/token',
       callbackURL: 'https://localhost:5000/sleepdata'
    },
	sslOptions = {
		key: fs.readFileSync('./server.key'),
		cert: fs.readFileSync('./server.crt')
	};

	app.use(bodyParser.json());

	app.use(express.static(__dirname + '/public'));

	app.set('view engine', 'ejs');
	app.set('views', __dirname + '/views');

// ----- Passport set up ----- //
app.use(passport.initialize());

app.get('/login/jawbone', 
	passport.authorize('jawbone', {
		scope: ['basic_read','extended_read','location_read','friends_read','mood_read','mood_write','move_read','move_write','sleep_read','sleep_write','meal_read','meal_write','generic_event_read','generic_event_write','heartrate_read'],
		failureRedirect: '/'
	})
);

app.get('/sleepdata',
	passport.authorize('jawbone', {
		scope: ['basic_read','extended_read','location_read','friends_read','mood_read','mood_write','move_read','move_write','sleep_read','sleep_write','meal_read','meal_write','generic_event_read','generic_event_write','heartrate_read'],
		failureRedirect: '/'
	}), function(req, res) {
		res.render('userdata', req.account);
	}
);

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.get('/', function(req, res) {
	res.render('index');
});

passport.use('jawbone', new JawboneStrategy({
	clientID: jawboneAuth.clientID,
	clientSecret: jawboneAuth.clientSecret,
	authorizationURL: jawboneAuth.authorizationURL,
	tokenURL: jawboneAuth.tokenURL,
	callbackURL: jawboneAuth.callbackURL
}, function(token, refreshToken, profile, done) {
	var options = {
			access_token: token,
			client_id: jawboneAuth.clientID,
			client_secret: jawboneAuth.clientSecret
		},
		up = require('jawbone-up')(options);

	up.sleeps.get({}, function(err, body) {
    	if (err) {
    		console.log('Error receiving Jawbone UP data');
    	} else {
    		var jawboneData = JSON.parse(body).data;
			console.log(jawboneData)

        	/*for (var i = 0; i < jawboneData.items.length; i++) {
        		var date = jawboneData.items[i].date.toString(),
        			year = date.slice(0,4),
        			month = date.slice(4,6),
        			day = date.slice(6,8);


        		jawboneData.items[i].date = day + '/' + month + '/' + year;
        		jawboneData.items[i].title = jawboneData.items[i].title.replace('for ', '');
        	}*/

			return done(null, jawboneData, console.log('Jawbone UP data ready to be displayed.'));
    	}
    });
	up.events.cardiac.get({}, function(err, body) {
    	if (err) {
    		console.log('Error receiving Jawbone UP data');
    	} else {
    		var jawboneData = JSON.parse(body).data;
			//console.log(jawboneData)

        	

			//return done(null, jawboneData, console.log('Jawbone UP data ready to be displayed.'));
    	}
    });
	
	up.meals.get({}, function(err, body) {
    	if (err) {
    		console.log('Error receiving Jawbone UP data');
    	} else {
    		var jawboneData = JSON.parse(body).data;
			console.log("melas")
			console.log(jawboneData)

        	

			//return done(null, jawboneData, console.log('Jawbone UP data ready to be displayed.'));
    	}
    });
	
	up.mood.get({}, function(err, body) {
    	if (err) {
    		console.log('Error receiving Jawbone UP data');
    	} else {
    		var jawboneData = JSON.parse(body).data;
			console.log("mood")
			console.log(jawboneData)

        	

			//return done(null, jawboneData, console.log('Jawbone UP data ready to be displayed.'));
    	}
    });
}));

var secureServer = https.createServer(sslOptions, app).listen(port, function(){
  	console.log('UP server listening on ' + port);
});