

console.log("sign in")

const signIn = () => {
    console.log("in function")
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
        var credential = result.credential;
        var token = credential.accessToken;

        var user = result.user;
        window.location = 'calendar.html';
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        const err = {
            errorCode,
            errorMessage,
            email,
            credential
        };
        console.log(err);
    })
    
};

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      window.location = 'calendar.html';
    };
  });
};