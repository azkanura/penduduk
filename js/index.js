// $(function(){
// 	$('select').select2();
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
    $('.display-username').html(email);
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


