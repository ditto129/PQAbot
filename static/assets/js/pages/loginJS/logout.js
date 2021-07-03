/* ===================== google logout ===================== */
/* ==========================================================
<a href="#" onclick="signOut();">Sign out Google account</a>
<!-- Google Cloud Platform JS -->
<script src="https://apis.google.com/js/platform.js?onload=onLoadGoogleCallback" async defer></script> 
============================================================== */
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}