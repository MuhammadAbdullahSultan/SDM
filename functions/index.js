const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
 exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
 });

var admin = require("firebase-admin");
var express = require("express");
//const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
//const app = express();

admin.initializeApp(functions.config().firebase);


//const validateFirebaseIdToken = (req, res, next) => {
//  console.log('Check if request is authorized with Firebase ID token');
//
//  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
//      !req.cookies.__session) {
//    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
//        'Make sure you authorize your request by providing the following HTTP header:',
//        'Authorization: Bearer <Firebase ID Token>',
//        'or by passing a "__session" cookie.');
//    res.status(403).send('Unauthorized');
//    return;
//  }
//
//  var idToken;
//  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
//    console.log('Found "Authorization" header');
//    // Read the ID Token from the Authorization header.
//    idToken = req.headers.authorization.split('Bearer ')[1];
//  } else {
//    console.log('Found "__session" cookie');
//    // Read the ID Token from cookie.
//    idToken = req.cookies.__session;
//  }
//  admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
//    console.log('ID Token correctly decoded', decodedIdToken);
//    req.user = decodedIdToken;
//    next();
//  }).catch(error => {
//    console.error('Error while verifying Firebase ID token:', error);
//    res.status(403).send('Unauthorized');
//  });
//};

//app.use(cors);
//app.use(cookieParser);
//app.use(validateFirebaseIdToken);

exports.hello2 = functions.https.onRequest((req, res) => {
    
    var uid = req.body.uid;
    
    admin.auth().deleteUser(uid)
      .then(function() {
        res.send("User with id " + uid + " deleted");
      })
      .catch(function(error) {
        console.log("Error deleting user:", error);
        res.send("Error deleting user: " + error);
      });
    
});


//exports.app = functions.https.onRequest(app);

//admin.auth().deleteUser(uid)
//  .then(function() {
//    console.log("Successfully deleted user");
//  })
//  .catch(function(error) {
//    console.log("Error deleting user:", error);
//  });
//
//
//
//admin.auth().verifyIdToken(idToken)
//  .then(function(decodedToken) {
//    var uid = decodedToken.uid;
//    
//    console.log(uid);
//    // ...
//  }).catch(function(error) {
//    // Handle error
//  });

//        res.set('Access-Control-Allow-Origin', "*");
//        res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');