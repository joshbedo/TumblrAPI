var express = require('express'),
	app     = express(),
	server  = require('http').createServer(app),
	io      = require('socket.io').listen(server),
	oauth   = require('oauth'),
	tumblr  = require('tumblr.js'),
	client  = {
		consumer_key: '1n9fMPxCBFBbcIGRImYKSK5wwDL6yux64S4DxEwiwzHTNuaIoD',
		consumer_secret: 'bW9YKbnwgxexyVx1AaxQr1QoemEkjd29p5U1WpbZ8r1XEH41C0',
	},
	consumer = new oauth.OAuth(
		"http://www.tumblr.com/oauth/request_token", "http://www.tumblr.com/oauth/access_token",
		client.consumer_key, client.consumer_secret, "1.0A", "http://localhost:1337/oauth/testapp", "HMAC-SHA1");


app.configure('development', function(){
	app.use(express.logger());
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ secret: "topsecret" }));
});


app.get('/home', function(req, res){
	consumer.getOAuthRequestToken(function(err, oauth_token, oauth_token_secret, results){
		if(err){
			console.log(err);
		}else{
			console.log(req.session);
			req.session.oauth = {token: oauth_token, token_secret: oauth_token_secret};
			console.log('oauth.token: ' + oauth_token);
			console.log('oauth.token_secret: ' + oauth_token_secret);
			res.redirect('http://www.tumblr.com/oauth/authorize?oauth_token='+oauth_token);
		}
	});
});

app.get('/oauth/testapp', function(req, res){
	console.log(req.session.oauth);
	var user = tumblr.createClient({
			consumer_key: client.consumer_key,
			consumer_secret: client.consumer_secret,
			token: req.session.oauth.token,
			token_secret: req.session.oauth.token_secret
	});
	user.userInfo(function(err, data){
		if(!err){
			console.log(data);
		}else{
			console.log(err);
		}
	});
});

server.listen(1337);
