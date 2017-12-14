// $(document).ready(function(){
// 	console.log('hahaha');
// 	var rootRef = firebase.database().ref().child("penduduk");
// 	rootRef.on("child_added", function(data) {
// 		console.log('hahaha');
// 		alert(data);
// 		console.log(data);
// 	});
// });
// var penduduk = db.collection('penduduk');
// var container = $('.px-content');
// penduduk.get().then((querySnapshot)=>{
// 	querySnapshot.forEach((doc)=>{
// 		if(doc && doc.exists){
// 			data = doc.data();
// 			container.append('Foto KTP: '+data.foto_ktp+'<br>Foto Orang: '+data.foto_orang+'<br>Jenis Kelamin: '+data.jenis_kelamin+'<br>Kecamatan: '+data.kecamatan+'<br>Kelurahan: '+data.kelurahan+'<br>Jenis kewarganegaraan: '+data.kewarganegaraan+'<br>Jenis Kisaran Penghasilan: '+data.kirasan_penghasilan+'<br>Kota: '+data.kota+'<br>Nama Lengkap:  '+data.nama_lengkap+' <br>Pekerjaan: '+data.pekerjaan+'<br>Pendidikan: '+data.pendidikan+'<br>Provinsi:  '+data.provinsi+'<br>RT:  '+data.rt+'<br>RW:  '+data.rw+'<br>Status Perkawinan:  '+data.status_perkawinan+'<br>Tempat Tanggal Lahir:  '+data.tempat_lahir+', '+data.tanggal_lahir+'<br><hr><br>');
// 		}
// 	});
// });

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;

    console.log(email);
    $('display-user-name').html(email);
    // ...
  } else {
    // User is signed out.
    // ...
    $(location).attr('href','/login');
  }
});


$('#logoutBtn').on('click',function(){
	firebase.auth().signOut().catch((error)=>{
		var errorCode = error.code;
        var errorMessage = error.message;
        console.log('Error '+errorCode+': '+errorMessage);
        alert('Error '+errorCode+': '+errorMessage);
	});
});


