var express = require('express'),
	app     = express(),
	server  = require('http').createServer(app),
	io      = require('socket.io').listen(server),
	oauth   = require('oauth'),
	tumblr  = require('tumblr.js'),
	client  = {
		consumer_key: '1n9fMPxCBFBbcIGRImYKSK5wwDL6yux64S4DxEwiwzHTNuaIoD',
		consumer_secret: 'bW9YKbnwgxexyVx1AaxQr1QoemEkjd29p5U1WpbZ8r1XEH41C0'
	},
	consumer = new oauth.OAuth(
		"http://www.tumblr.com/oauth/request_token", "http://www.tumblr.com/oauth/access_token",
		client.consumer_key, client.consumer_secret, "1.0A", "http://127.0.0.1:8080/sessions/callback", "HMAC-SHA1");

server.listen(1337);

app.configure('dev', function(){
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
			//req.session.oauth.token = oauth_token;
			console.log('oauth.token: ' + oauth_token);
			//req.session.oauth.token_secret = oauth_token_secret;
			console.log('oauth.token_secret: ' + oauth_token_secret);
			res.redirect('http://www.tumblr.com/oauth/authorize?oauth_token='+oauth_token);
		}
	});
});

app.get('/oauth/testapp', function(req, res){
	res.send('callback');
})
