/* ===================== google logout ===================== */
/* ==========================================================
<a href="#" onclick="signOut();">Sign out Google account</a>
<!-- Google Cloud Platform JS -->
<script src="https://apis.google.com/js/platform.js?onload=onLoadGoogleCallback" async defer></script> 
============================================================== */

function logout(){
    if(sessionStorage.getItem('role') == 'google_user'){
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('Google User signed out.');
        });
    }
    else if(sessionStorage.getItem('role') == 'facebook_user'){
        FB.logout(function(response) {
            console.log('Facebook User logout.');
          });
    }
    // flask logout
    $.ajax({
        type: 'GET',
        url: head_url +  'logout',
        success: function () {
            console.log('flask logout.')
        }
    });
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('role');
}