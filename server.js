// var connect = require('connect');
// var serveStatic = require('serve-static');
// connect().use(serveStatic(__dirname)).listen(8080, function(){
//     console.log('Server running on 8080...');
// });

var express = require('express');
var app = express();
var path = require('path');
// var reload = require('../../reload');
var nunjucks=require('nunjucks');
var bodyParser = require('body-parser');
// initialize firebase in serverside
var firebase = require("firebase");
require("firebase/firestore");
// Initialize Firebase
var config = {
  apiKey: "AIzaSyAOyzUWIUMHE3YVx64KicRUjcMCbsn6gZQ",
  authDomain: "penduduk-app.firebaseapp.com",
  databaseURL: "https://penduduk-app.firebaseio.com",
  projectId: "penduduk-app",
  storageBucket: "penduduk-app.appspot.com",
  messagingSenderId: "216960976294"
};
firebase.initializeApp(config);

if(!firebase){
    alert('Cannot connect to database. Please check your internet connection!')
}


var db = firebase.firestore();
var users = db.collection('users');
// var storage = firebase.storage();
// var penduduk = db.collection('penduduk');
// initialize firebase in serverside

// app.use(app.router);
app.use(express.static(__dirname));
nunjucks.configure('views',{
	autoescape: true,
	express: app
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

app.get('/rt/:provinsi/:kota/:kecamatan/:kelurahan/:rw/:rt',function(req,res){
	var provinsi = req.params.provinsi;
	var kota = req.params.kota;
	var kecamatan = req.params.kecamatan;
	var kelurahan = req.params.kelurahan;
	var rw = req.params.rw;
	var rt = req.params.rt;
	res.render('rt.html',{provinsi:provinsi,kota:kota,kecamatan:kecamatan,kelurahan:kelurahan,rw:rw,rt:rt});
});

app.get('/rw/:provinsi/:kota/:kecamatan/:kelurahan/:rw',function(req,res){
	var provinsi = req.params.provinsi;
	var kota = req.params.kota;
	var kecamatan = req.params.kecamatan;
	var kelurahan = req.params.kelurahan;
	var rw = req.params.rw;
	res.render('rw.html',{provinsi:provinsi,kota:kota,kecamatan:kecamatan,kelurahan:kelurahan,rw:rw});
});

app.get('/kelurahan/:provinsi/:kota/:kecamatan/:kelurahan',function(req,res){
	var provinsi = req.params.provinsi;
	var kota = req.params.kota;
	var kecamatan = req.params.kecamatan;
	var kelurahan = req.params.kelurahan;
	res.render('kel.html',{provinsi:provinsi,kota:kota,kecamatan:kecamatan,kelurahan:kelurahan});
});

app.get('/kecamatan/:provinsi/:kota/:kecamatan',function(req,res){
	var provinsi = req.params.provinsi;
	var kota = req.params.kota;
	var kecamatan = req.params.kecamatan;
	res.render('kec.html',{provinsi:provinsi,kota:kota,kecamatan:kecamatan});
});

app.get('/kota/:provinsi/:kota',function(req,res){
	var provinsi = req.params.provinsi;
	var kota = req.params.kota;
	res.render('kota.html',{provinsi:provinsi,kota:kota});
});

app.get('/provinsi/:provinsi',function(req,res){
	var provinsi = req.params.provinsi;
	res.render('prov.html',{provinsi:provinsi});
});

app.get('/penduduk',function(req,res){
	res.render('penduduk.html');
});

app.get('/penduduk-detail/:id',function(req,res){
	var id = req.params.id;
	res.render('penduduk-detail.html',{id:id});
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

app.post('/save-user',function(req,res){
	console.log(req.body);
	var fullname=req.body.full_name;
	var email=req.body.email;
	console.log(email);
	var password=req.body.password;
	var role=req.body.role;
	var level=req.body.level;
	var province='';
	var city='';
	var district='';
	var subdistrict='';
	if(req.body.province){
		province = req.body.province;
	}
	if(req.body.city){
		city = req.body.city;
	}
	if(req.body.district){
		district = req.body.district;
	}
	if(req.body.subdistrict){
		subdistrict = req.body.subdistrict;
	}

	var area = {
		country:'Indonesia',
		province:province,
		city:city,
		district:district,
		subdistrict:subdistrict
	}
	firebase.auth().createUserWithEmailAndPassword(email, password).then(()=>{
		users.add({
			full_name : fullname,
			email : email,
			role : role,
			level : level,
			area : area
		})
		.then(function(docRef) {
			res.redirect('/user');
		    console.log("Document written with ID: ", docRef.id);
		})
		.catch(function(error) {
			alert('error! cannot save user')
		    console.error("Error adding document: ", error);
		});
	}).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  alert('Error '+errorCode+': '+errorMessage);
	  // ...
	});
});

app.get('/test',function(req,res){
	res.render('test.html')
});


// reload(app);
app.listen(8080,function(){
	console.log('App Running on port 8080');
	// console.log(firebase);
});


// var connect = require('connect');
// var serveStatic = require('serve-static');
// connect().use(serveStatic(__dirname)).listen(8080, function(){
//     console.log('Server running on 8080...');
// });