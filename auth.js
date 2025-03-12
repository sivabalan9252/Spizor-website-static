function sendOTP() {
    const email = document.getElementById('email').value;
    auth.sendSignInLinkToEmail(email, {
        url: window.location.href, // Redirect URL after login
        handleCodeInApp: true,
    }).then(() => {
        alert("OTP sent to email! Check your inbox.");
        localStorage.setItem('emailForSignIn', email);
        document.getElementById('otp').style.display = "block";
        document.getElementById('verify-btn').style.display = "block";
    }).catch(error => console.error(error.message));
}

function verifyOTP() {
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
        let email = localStorage.getItem('emailForSignIn');
        auth.signInWithEmailLink(email, window.location.href)
            .then((result) => {
                console.log("User signed in:", result.user);
                saveUserData(result.user);
                document.getElementById('login-section').style.display = "none";
                document.getElementById('content-section').style.display = "block";
            })
            .catch(error => console.error(error.message));
    }
}

function saveUserData(user) {
    db.collection("users").doc(user.uid).set({
        email: user.email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.log("User data saved.");
    }).catch(error => console.error("Error saving user:", error));
}

window.onload = function() {
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
        verifyOTP();
    }
};
