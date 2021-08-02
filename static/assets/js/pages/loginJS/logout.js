/* ===================== google logout ===================== */
/* ==========================================================
<a href="#" onclick="signOut();">Sign out Google account</a>
<!-- Google Cloud Platform JS -->
<script src="https://apis.google.com/js/platform.js?onload=onLoadGoogleCallback" async defer></script> 
============================================================== */
//var head_url = "https://soselab.asuscomm.com:55002/api/"
var head_url = "https://5645a731eeda.ngrok.io/api/"
function googleSignOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('Google User signed out.');
    });

    $.ajax({
        type: 'GET',
        url: head_url +  'logout',
        success: function () {
            console.log('flask logout.')
        }
    });
    
}

function facebookLogout(){
    FB.logout(function(response) {
        console.log('Facebook User logout.');
      });

    $.ajax({
        type: 'GET',
        url: head_url +  'logout',
        success: function () {
            console.log('flask logout.')
        }
    });
}