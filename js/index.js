// $(document).ready(function(){
// 	console.log('hahaha');
// 	var rootRef = firebase.database().ref().child("penduduk");
// 	rootRef.on("child_added", function(data) {
// 		console.log('hahaha');
// 		alert(data);
// 		console.log(data);
// 	});
// });

db.collection('penduduk').get().then((querySnapshot)=>{
	querySnapshot.forEach((doc)=>{
		console.log(`${doc.id}=>${doc.data().foto_orang}`);
	});
});