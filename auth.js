// Ensure Firebase is loaded before using it
if (typeof firebase === "undefined") {
    alert("Firebase SDK failed to load. Check your internet connection or script order.");
}

// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase (Only if not already initialized)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Ensure Firebase is initialized before running functions
document.addEventListener("DOMContentLoaded", function () {
    // Send OTP via Email
    function sendOTP() {
        const email = document.getElementById("email").value.trim();

        if (!email) {
            alert("Please enter your email.");
            return;
        }

        const actionCodeSettings = {
            url: window.location.href, // Redirects back after login
            handleCodeInApp: true
        };

        auth.sendSignInLinkToEmail(email, actionCodeSettings)
            .then(() => {
                alert("OTP link sent! Check your email.");
                localStorage.setItem("emailForSignIn", email);
            })
            .catch(error => alert("Error sending OTP: " + error.message));
    }

    // Verify OTP and Save User Info
    function verifyOTP() {
        if (auth.isSignInWithEmailLink(window.location.href)) {
            let email = localStorage.getItem("emailForSignIn");

            if (!email) {
                email = prompt("Please enter your email to confirm login:");
                if (!email) return alert("Email is required.");
            }

            auth.signInWithEmailLink(email, window.location.href)
                .then(result => {
                    localStorage.removeItem("emailForSignIn");

                    // Show fields for additional details
                    document.getElementById("otp").style.display = "none";
                    document.getElementById("verify-btn").style.display = "none";
                    document.getElementById("name").style.display = "block";
                    document.getElementById("phone").style.display = "block";
                    document.getElementById("type").style.display = "block";
                    document.getElementById("save-user-btn").style.display = "block";

                    alert("OTP Verified! Please fill in additional details.");
                })
                .catch(error => alert("Verification failed: " + error.message));
        }
    }

    // Validate Phone Number
    function isValidPhone(phone) {
        return /^[0-9]{10,15}$/.test(phone); // Accepts 10 to 15 digit numbers
    }

    // Save user details in Firestore
    function saveUserInfo() {
        const user = auth.currentUser;
        if (!user) {
            alert("User not found. Please log in again.");
            return;
        }

        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const type = document.getElementById("type").value;

        if (!name || !phone || !type) {
            alert("Please fill in all details before proceeding.");
            return;
        }

        if (!isValidPhone(phone)) {
            alert("Please enter a valid phone number.");
            return;
        }

        db.collection("users").doc(user.uid).set({
            email: user.email,
            name: name,
            phone: phone,
            type: type,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            alert("User details saved successfully!");
            window.location.href = "index.html"; // Redirect to homepage
        })
        .catch(error => alert("Error saving user details: " + error.message));
    }

    // Attach functions to window (Global Scope Fix)
    window.sendOTP = sendOTP;
    window.verifyOTP = verifyOTP;
    window.saveUserInfo = saveUserInfo;

    // Auto-login if OTP link is clicked
    if (auth.isSignInWithEmailLink(window.location.href)) {
        if (localStorage.getItem("emailForSignIn")) {
            verifyOTP();
        } else {
            alert("No email found in storage. Please log in manually.");
        }
    }
});
