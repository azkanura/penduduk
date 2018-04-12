// var connect = require('connect');
// var serveStatic = require('serve-static');
// connect().use(serveStatic(__dirname)).listen(8080, function(){
//     console.log('Server running on 8080...');
// });

var express = require('express');
var app = express();
var path = require('path');
var cors = require('cors')({origin:true});
var fileUpload = require('express-fileupload');
var port = process.env.PORT || 8080;

// var reload = require('../../reload');
var nunjucks=require('nunjucks');
var bodyParser = require('body-parser');
// var flash = require('connect-flash');
// initialize firebase in serverside
var firebase = require("firebase");
require("firebase/firestore");
// var dotenv = require('dotenv');
var functions = require('firebase-functions');
var algoliasearch = require('algoliasearch');
var algoliaSync = require('algolia-firestore-sync');
// dotenv.load();
//
// var algolia = algoliasearch(
//   process.env.ALGOLIA_APP_ID,
//   process.env.ALGOLIA_API_KEY
// );
//
// var index = algolia.initIndex(process.env.ALGOLIA_INDEX_NAME);

const googleStorage = require('@google-cloud/storage');
var storage = googleStorage({
  projectId: "penduduk-app",
  keyFileName: "service-account-credentials.json"
});

var bucket = storage.bucket("penduduk-app.appspot.com");

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
var penduduk = db.collection('penduduk');

var algolia = algoliasearch(
  'HD3FUMIQJF',
  '632cd6090f2f70f2ac2da1ba9421b1ad'
);

var index = algolia.initIndex('penduduk');
var records = [];
index.clearIndex(function(err, content) {
  console.log(content);
});

penduduk.get().then((query)=>{
  query.forEach((doc)=>{
    if(doc && doc.exists){
      var childKey = doc.id;
      var childData = doc.data();
      childData.objectID = childKey;
      childData.koordinat="0,0";
      childData.alamat="-";
      childData.nomor_kk="-";
      penduduk.doc(childKey).collection('dokumen').get().then((q)=>{
        q.forEach((d)=>{
          if(d && d.exists){
            childData.koordinat=d.data().koordinat;
            childData.alamat=d.data().alamat;
            childData.nomor_kk=d.data().nomor_kk;
          }
        });
        console.log(childData.koordinat);
        records.push(childData);
        console.log(records);
      }).catch((error)=>{
        console.log('Tidak dapat menemukan koordinat!');
        records.push(childData);
        console.log(records);
      });
    }
  });

  setTimeout(function(){
    if(records.length){
      index.saveObjects(records).then(()=>{
        console.log('Penduduk imported into Algolia');
      }).catch((error)=>{
        console.error('Error when importing penduduk into Algolia', error);
        process.exit(1);
      });
    }
    else{
      console.log('Error when importing penduduk into Algolia, no records found');
    }
  },20000);

});

setInterval(function(){
  var records = [];
  index.clearIndex(function(err, content) {
    console.log(content);
  });
  penduduk.get().then((query)=>{
    query.forEach((doc)=>{
      if(doc && doc.exists){
        var childKey = doc.id;
        var childData = doc.data();
        childData.objectID = childKey;
        childData.koordinat="0,0";
        childData.alamat="-";
        childData.nomor_kk="-";
        penduduk.doc(childKey).collection('dokumen').get().then((q)=>{
          q.forEach((d)=>{
            if(d && d.exists){
              childData.koordinat=d.data().koordinat;
              childData.alamat=d.data().alamat;
              childData.nomor_kk=d.data().nomor_kk;
            }
          });
          console.log(childData.koordinat);
          records.push(childData);
          console.log(records);
        }).catch((error)=>{
          console.log('Tidak dapat menemukan koordinat!');
          records.push(childData);
          console.log(records);
        });
      }
    });

    setTimeout(function(){
      if(records.length){
        index.saveObjects(records).then(()=>{
          console.log('Penduduk imported into Algolia');
        }).catch((error)=>{
          console.error('Error when importing penduduk into Algolia', error);
          process.exit(1);
        });
      }
      else{
        console.log('Error when importing penduduk into Algolia, no records found');
      }
    },20000);

  });
},300000);


// initialize firebase in serverside
// app.configure(function() {
  // app.use(express.cookieParser('keyboard cat'));
  // app.use(express.session({ cookie: { maxAge: 60000 }}));
// app.use(flash());
// });

// app.use(app.router);
// app.use(cors());
app.use(express.static(__dirname));
nunjucks.configure('views',{
	autoescape: true,
	express: app
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());

app.get('/',function(req,res){
	res.render('index.html');
});

app.get('/laporan',function(req,res){
	res.render('laporan.html');
});

app.get('/survey',function(req,res){
	res.render('survey.html');
});
// app.get('/survey/search',function(req,res){
//   var keyword = req.body.s;
//   var resRef = penduduk.where("nama_lengkap",keyword);
// 	res.render('survey.html',{keyword:keyword,resident:resident});
// });

app.get('/login',function(req,res){
	res.render('login.html');
});

app.get('/analitik',function(req,res){
	res.render('analitik.html');
});

app.get('/cari',function(req,res){
  // res.render('cari.html');
	res.render('search.html');
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

app.get('/penduduk-create',function(req,res){
	res.render('penduduk-create.html');
});

app.get('/penduduk-detail/:id',function(req,res){
	var id = req.params.id;
	res.render('penduduk-detail.html',{id:id});
});

app.get('/penduduk-edit/:id',function(req,res){
	var id = req.params.id;
	res.render('penduduk-edit.html',{id:id});
});

app.post('/penduduk-personal-save',function(req,res){
  var id = req.body.id;
  var resident = penduduk.doc(id);
  resident.update({
    agama:req.body.religion,
    bidang_pekerjaan:req.body.job_field,
    golongan_darah:req.body.blood_type,
    jenis_kelamin:req.body.gender,
    kecamatan:req.body.district,
    kelurahan:req.body.subdistrict,
    kewarganegaraan:req.body.nationality,
    kirasan_penghasilan:req.body.income,
    kota:req.body.city,
    nama_lengkap:req.body.name,
    pekerjaan:req.body.job,
    pendidikan:req.body.education,
    provinsi:req.body.province,
    rt:req.body.rt,
    rw:req.body.rw,
    status_perkawinan:req.body.marriage,
    tanggal_lahir:req.body.birth_date,
    tempat_lahir:req.body.birth_place
  }).then(function() {
    console.log('Data pribadi berhasil diubah');
  })
  .catch(function(error) {
    console.log('Data pribadi gagal diubah, terjadi kesalahan teknis');
  });

  res.redirect('/penduduk-edit/'+id);
});

app.post('/anggota-personal-save',function(req,res){
  var id = req.body.id;
  var kkId = req.body.kk_id;
  var resident = penduduk.doc(kkId).collection('anggota').doc(id);
  resident.update({
    agama:req.body.religion,
    bidang_pekerjaan:req.body.job_field,
    golongan_darah:req.body.blood_type,
    jenis:req.body.status,
    jenis_kelamin:req.body.gender,
    kewarganegaraan:req.body.nationality,
    kirasan_penghasilan:req.body.income,
    nama_lengkap:req.body.name,
    pekerjaan:req.body.job,
    pendidikan:req.body.education,
    status_perkawinan:req.body.marriage,
    tanggal_lahir:req.body.birth_date,
    tempat_lahir:req.body.birth_place
  }).then(function() {
    console.log('Data anggota keluarga berhasil diubah');
  })
  .catch(function(error) {
    console.log('Data anggota keluarga gagal diubah, terjadi kesalahan teknis');
  });

  res.redirect('/anggota-edit/'+kkId+'/'+id);
});

app.post('/penduduk-asset-save',function(req,res){
  var id = req.body.id;
  var resident = penduduk.doc(id);
  var asset = resident.collection('rumah').doc('data');
  var goods = req.body.goods;
  var goodText ='';
  goods.forEach((good)=>{
    if(good){
      goodText+=good+'|';
    }
  });
  var scoreGoods = req.body.score_goods;
  var score_goodText ='';
  scoreGoods.forEach((scoreGood)=>{
    if(scoreGood){
      score_goodText+=scoreGood+'|';
    }
  });
  var data = {
    luas_lantai:req.body.area,
    jenis_lantai:req.body.floor,
    jenis_dinding:req.body.wall,
    fasilitas:req.body.facility,
    sumber_air:req.body.water,
    sumber_penerangan:req.body.electricity,
    bahan_bakar:req.body.cooking,
    berapa_kali_sekali:req.body.meal,
    berapa_kali_seminggu:req.body.meat,
    berapa_kali_sepekan:req.body.clothing,
    anggota_sakit:req.body.sickness,
    list_barang:goodText,
    kredit_usaha:req.body.credit,
    status_bangunan:req.body.house_status,
    skor_luas_lantai:req.body.score_area,
    skor_jenis_lantai:req.body.score_floor,
    skor_jenis_dinding:req.body.score_wall,
    skor_fasilitas:req.body.score_facility,
    skor_sumber_air:req.body.score_water,
    skor_sumber_penerangan:req.body.score_electricity,
    skor_bahan_bakar:req.body.score_cooking,
    skor_berapa_kali_sekali:req.body.score_meal,
    skor_berapa_kali_seminggu:req.body.score_meat,
    skor_berapa_kali_sepekan:req.body.score_clothing,
    skor_anggota_sakit:req.body.score_sickness,
    skor_list_barang:score_goodText,
    skor_kredit_usaha:req.body.score_credit,
    skor_status_bangunan:req.body.score_house_status,
  };
  asset.update(data).then(function() {
    console.log('Data aset berhasil diubah');
  })
  .catch(function(error) {
    asset.set(data).then(function(){
      console.log('Data aset berhasil ditambahkan');
    }).catch(function(error){
      console.log('Data aset gagal diubah/ditambahkan, terjadi kesalahan teknis');
    });
  });

  res.redirect('/penduduk-edit/'+id);
});

app.get('/profile',function(req,res){
  res.render('profile.html');
});

app.get('/profile-edit',function(req,res){
  res.render('profile-edit.html');
});

app.get('/profile/change-password',function(req,res){
  res.render('change-password.html');
});
// app.post('/penduduk-asset-img-save',function(req,res){
//   var id = req.body.id;
//   var resident = penduduk.doc(id);
//   var assetImg = resident.collection('rumah').doc('gambar');
//   var filePath;
//   if(req.files.photo_family_head){
//     var photoFamilyHead = req.files.photo_family_head;
//     var fhName = 'images/kk-'+id+'.jpg';
//     var fhStorageRef=firebase.storage().ref(fhName);
//     var fhTask = fhStorageRef.put(photoFamilyHead);
//     fhTask.on('state_changed',
//       function complete(){
//         assetImg.update({foto_kepala_keluarga:fhName});
//       },
//       function error(err){
//         console.log('error: '+err);
//       }
//     );
//   }
//   if(req.files.photo_terrace){
//     var photoTerrace = req.files.photo_terrace;
//     var tName = 'images/dr-'+id+'.jpg';
//     var tStorageRef=firebase.storage().ref(tName);
//     var tTask = tStorageRef.put(photoTerrace);
//     tTask.on('state_changed',
//       function complete(){
//         assetImg.update({foto_depan_rumah:tName});
//       },
//       function error(err){
//         console.log('error: '+err);
//       }
//     );
//   }
//   if(req.files.photo_living_room){
//     var photoLivingroom = req.files.photo_living_room;
//     var lrName = 'images/rt-'+id+'.jpg';
//     var lrStorageRef=firebase.storage().ref(lrName);
//     var lrTask = lrStorageRef.put(photoLivingroom);
//     lrTask.on('state_changed',
//       function complete(){
//         assetImg.update({foto_ruang_tamu:lrName});
//       },
//       function error(err){
//         console.log('error: '+err);
//       }
//     );
//   }
//   if(req.files.photo_kitchen){
//     var photoKitchen = req.files.photo_kitchen;
//     var kName = 'images/d-'+id+'.jpg';
//     var kStorageRef=firebase.storage().ref(kName);
//     var kTask = kStorageRef.put(photoKitchen);
//     kTask.on('state_changed',
//       function complete(){
//         assetImg.update({foto_dapur:kName});
//       },
//       function error(err){
//         console.log('error: '+err);
//       }
//     );
//   }
//   if(req.files.photo_backyard){
//     var photoBackyard = req.files.photo_backyard;
//     var bName = 'images/br-'+id+'.jpg';
//     var bStorageRef=firebase.storage().ref(bName);
//     var bTask = bStorageRef.put(photoBackyard);
//     bTask.on('state_changed',
//       function complete(){
//         assetImg.update({foto_belakang_rumah:bName});
//       },
//       function error(err){
//         console.log('error: '+err);
//       }
//     );
//   }
//   res.redirect('/penduduk-edit/'+id);
// });
app.post('/penduduk-document-save',function(req,res){
  var id = req.body.id;
  var resident = penduduk.doc(id);
  var documents = resident.collection('dokumen');

  documents.get().then((querySnapshot)=>{
    querySnapshot.forEach((doc)=>{
      var doc_id = doc.id;
      var kkPhoto = doc.data().foto_kk;
      var coordinate = doc.data().koordinat;
      var document = documents.doc(doc_id);
      document.update({
        nomor_kk:req.body.kk_number,
        provinsi:req.body.province,
        kota:req.body.city,
        kecamatan:req.body.district,
        kelurahan:req.body.subdistrict,
        rw:req.body.rw,
        rt:req.body.rt,
        alamat:req.body.address,
        foto_kk:kkPhoto,
        koordinat:req.body.geolocation
      }).then(function(){
        console.log('Data aset berhasil diubah');

      }).catch(function(error){
        console.log('Data aset gagal diubah, terjadi kesalahan teknis');
      });
      res.redirect('/penduduk-edit/'+id);

    });
  });
});


app.get('/anggota-detail/:kkId/:id',function(req,res){
	var id = req.params.id;
	var kkId = req.params.kkId;
	res.render('anggota-detail.html',{kkId:kkId,id:id});
});

app.get('/anggota-edit/:kkId/:id',function(req,res){
	var id = req.params.id;
	var kkId = req.params.kkId;
	res.render('anggota-edit.html',{kkId:kkId,id:id});
});

app.get('/anggota-create/:kkId',function(req,res){
	var kkId = req.params.kkId;
	res.render('anggota-create.html',{kkId:kkId});
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
			alert('error! cannot save user');
		    console.error("Error adding document: ", error);
		});
	}).catch(function(error) {
  	  res.redirect('/');
	});
});

app.get('/test',function(req,res){
	res.render('test.html')
});


// reload(app);
app.listen(port,function(){
	console.log('App Running on port 8080');
	// console.log(firebase);
});


// var connect = require('connect');
// var serveStatic = require('serve-static');
// connect().use(serveStatic(__dirname)).listen(8080, function(){
//     console.log('Server running on 8080...');
// });
