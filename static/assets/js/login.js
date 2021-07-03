/* Facebook Login */
// 設定 Facebook JavaScript SDK
window.fbAsyncInit = function () {
    FB.init({
      appId: '1018939978932508',
      cookie: true,
      xfbml: true,
      version: 'v11.0'
    });

    FB.AppEvents.logPageView();

};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// 檢查Facebook登入狀態
function checkLoginState() {
// 取得登入狀態資訊
    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
        console.log(response)
        // 若已登入則利用facebook api取得使用者資料
        FB.api(
            '/me',
            'GET', {
            "fields": "name,id"
            },
            function (response) {
            console.log(response)
            // 取得使用者資料丟到後端
            $.ajax({
                type: "POST",
                url: '/facebook_sign_in',
                data: JSON.stringify(response),
                success: function () {
                console.log('Facebook login success')
                },
                dataType: 'application/json',
                contentType: "application/json",
            });
            });
        }
    });
}

/*-----------------*/

/* Google Sign in */
function onLoadGoogleCallback(){
  gapi.load('auth2', function() {
    auth2 = gapi.auth2.init({
      client_id: '417777300686-b6isl0oe0orcju7p5u0cpdeo07hja9qs.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
      scope: 'profile'
    });

  auth2.attachClickHandler(element, {},
    function(googleUser) {
        var profile = googleUser.getBasicProfile();
        $.ajax({
          type: "POST",
          url: '/google_sign_in',
          data: JSON.stringify({
            'id_token': googleUser.getAuthResponse().id_token
          }),
          success: function () {
            console.log('google login success')
          },
          dataType: 'application/json',
          contentType: "application/json",
        });
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
      }, function(error) {
        console.log('Sign-in error', error);
      }
    );
  });

  element = document.getElementById('customBtn');
}
  //google logout
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}
/*-----------------*/