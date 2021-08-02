/* ===================== google logout ===================== */
/* ==========================================================
<a href="#" onclick="signOut();">Sign out Google account</a>
<!-- Google Cloud Platform JS -->
<script src="https://apis.google.com/js/platform.js?onload=onLoadGoogleCallback" async defer></script> 
============================================================== */
function googleSignOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('Google User signed out.');
    });
}

function facebookLogout(){
    FB.logout(function(response) {
        console.log('Facebook User logout.');
      });
}