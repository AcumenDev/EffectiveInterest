/**
 * Created by vst on 5/13/17.
 */

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAb4DAsvJteZ_lZWKUGmVpwMsxPBVVSD8o",
    authDomain: "effectiveinterest.firebaseapp.com",
    databaseURL: "https://effectiveinterest.firebaseio.com",
    projectId: "effectiveinterest",
    storageBucket: "effectiveinterest.appspot.com",
    messagingSenderId: "132165627798"
};
firebase.initializeApp(config);

var user = firebase.auth().currentUser;

if (user) {
    database.ref('users/').set(user);
} else {
    sigIn();
}

function sigIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/plus.login');


    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(token, user);
        // ...
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });

}


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        user.providerData.forEach(function (profile) {
            console.log("Sign-in provider: "+profile.providerId);
            console.log("  Provider-specific UID: "+profile.uid);
            console.log("  Name: "+profile.displayName);
            console.log("  Email: "+profile.email);
            console.log("  Photo URL: "+profile.photoURL);
        });
        // User is signed in
        var email = user.email;
        var database = firebase.database();
        firebase.database.enableLogging(true);
        firebase.database.enableLogging(function(message) {
            console.log("[FIREBASE]", message);
        });
        //firebase.auth().currentUser
       // database.ref('users/' + user.uid).set(user);
        // ...
    } else {
        // User is not signed in
        // ...
    }
});


