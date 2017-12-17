// $(function(){
// 	$('select').select2();
// });
var storageRef=storage.ref();
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var email = user.email;
    var users = db.collection('users');
    users.where('email','==',email).limit(1).get().then((querySnapshot)=>{
        querySnapshot.forEach((doc)=>{
            data = doc.data();
            var firstname=data.full_name.split(" ")[0];

            $('#displayFirstname').html(firstname);
            $('#displayUsername').html(data.full_name);
            storageRef.child(data.photo_url).getDownloadURL().then((url)=>{
                $('.profile-picture').attr('src',url);
            });
        });
    });

    console.log(email);
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


