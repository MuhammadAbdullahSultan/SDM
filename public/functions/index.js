const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


var admin = require("firebase-admin");

var serviceAccount = require("path/to/xfab-downtime-firebase-adminsdk-oq0h9-39718f9ddb.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://xfab-downtime.firebaseio.com"
});

    


functions.https.onRequest((req, res) => {
  admin.auth().verifyIdToken(res)
  .then(function(decodedToken) {
    var uid = decodedToken.uid;
    
//    functions.auth.user().onDelete(event => {
//      admin.auth().deleteUser(uid)
//      .then(function() {
//        console.log("Successfully deleted user");
//      })
//      .catch(function(error) {
//        console.log("Error deleting user:", error);
//      });
//    });
    
    console.log(uid);
    // ...
  }).catch(function(error) {
    // Handle error
  });
});



