// var connect = require('connect');
// var serveStatic = require('serve-static');
// connect().use(serveStatic(__dirname)).listen(8080, function(){
//     console.log('Server running on 8080...');
// });

var express = require('express');
var app = express();
var path = require('path');
var nunjucks=require('nunjucks');

// app.use(app.router);
app.use(express.static(__dirname));
nunjucks.configure('views',{
	autoescape: true,
	express: app
});

app.get('/',function(req,res){
	res.render('index.html');
});

app.get('/login',function(req,res){
	res.render('login.html');
});

app.get('/analitik',function(req,res){
	res.render('analitik.html');
});

app.get('/cari',function(req,res){
	res.render('cari.html');
});

app.get('/rt',function(req,res){
	res.render('rt.html');
});

app.get('/rw',function(req,res){
	res.render('rw.html');
});

app.get('/kelurahan',function(req,res){
	res.render('kel.html');
});

app.get('/kecamatan',function(req,res){
	res.render('kec.html');
});

app.get('/kota',function(req,res){
	res.render('kota.html');
});

app.get('/provinsi',function(req,res){
	res.render('prov.html');
});

app.get('/penduduk',function(req,res){
	res.render('penduduk.html');
});

app.get('/penduduk-detail',function(req,res){
	res.render('penduduk-detail.html');
});

app.get('/user',function(req,res){
	res.render('user.html');
});

app.get('/user-detail',function(req,res){
	res.render('user-detail.html');
});

app.get('/user-editor',function(req,res){
	res.render('user-editor.html');
});

app.get('/test',function(req,res){
	res.render('test.html')
});



app.listen(8080,function(){
	console.log('App Running on port 8080')
});
// var connect = require('connect');
// var serveStatic = require('serve-static');
// connect().use(serveStatic(__dirname)).listen(8080, function(){
//     console.log('Server running on 8080...');
// });