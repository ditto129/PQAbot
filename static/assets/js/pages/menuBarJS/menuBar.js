//var head_url = "http://127.0.0.1/";
var session_id;
var first_start = true;

function setPage(page){
    localStorage.setItem("page", page);
    console.log("呼叫");
    changePage();
}

function changePage(){
    console.log("執行");
    var page = localStorage.getItem("page");
    console.log("執行page: "+page);
    var content = "";
    content += '<iframe MARGINWIDTH=0 MARGINHEIGHT=0 HSPACE=0 VSPACE=0 frameborder=0 scrolling=auto src="';
    content += page;
    content += '" height="100%" width="100%"></iframe>';
    document.getElementById("main_page").innerHTML = content;

}

function bot(string){
    console.log("bot送訊息");
    
    var history = document.getElementById("history_message");
    var content = history.innerHTML;
    content += '<div class="d-flex justify-content-start mb-4">';
    content += '<div class="img_cont_msg">';
    content += '<img src="../static/images/baymaxChat.png" class="chatImg">';
    content += '</div>';
    content += '<div class="msg_cotainer">';
    content += string;
    content += '<span class="msg_time">8:40 AM</span>';
    content += '</div>';
    content += '</div>';
    
    history.innerHTML = content;
    history.scrollTop = history.scrollHeight;
}

function user(string){
    console.log("user送訊息");
    var history = document.getElementById("history_message");
    var content = history.innerHTML;
    content += '<div class="d-flex justify-content-end mb-4">';
    content += '<div class="msg_cotainer_send">';
    content += string;
    content += '<span class="msg_time">8:40 AM</span>';
    content += '</div>';
    content += '<div class="img_cont_msg">';
    content += '<img src="../static/images/jackson.png" class="chatImg">';
    content += '</div>';
    content += '</div>';
    
    history.innerHTML = content;
    history.scrollTop = history.scrollHeight;
}



//start
function start(){
    localStorage.setItem("page", "home");
    changePage();
    
	$(document).ready(function(){
        $('#action_menu_btn').click(function(){
            $('.action_menu').toggle();
        });
    });

    
    //到時候要用session_id
    
    //session_id = window.prompt("請輸入mail的前綴(要用來當session_id)");
    localStorage.setItem("sessionID", 123);
    var session_id = localStorage.getItem("sessionID");
    console.log("session_id: "+ session_id);
    console.log("head_url: "+head_url);
    //傳session_start
    var myURL = head_url + "session_start?sender_id="+session_id;
//    var myURL = head_url + "session_start?sender_id=123";
    console.log("myURL: "+myURL);
    $.ajax({
        url: myURL,
        type: "GET",
        dataType: "json",
        async:false,
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log("response: "+response);
            console.log(response.message);
        },
        error: function(){
            console.log("error");
        }
    });
    
    //傳start
    
    
    var myURL = head_url + "welcome?sender_id="+session_id;
    console.log("myURL: "+myURL);
    $.ajax({
        url: myURL,
        type: "GET",
        dataType: "json",
        async:false,
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log("response: "+response);
            console.log(response.text);
            bot(response.text)
        },
        error: function(){
            console.log("error");
        }
    });
}

function send_message(){
    console.log("send_message");
    var message = $("#message").val();
    console.log("message: "+message);
    
    user(message);
    
    //用來清空傳出去的輸入框
    var msg = document.getElementById("message");
//    msg.innerHTML = "";
    msg.value = ""
    console.log("有清空");
    //直接用session_id會undifine!!
    session_id = localStorage.getItem("sessionID");
    var myURL = head_url + "base_flow_rasa?message="+message+"&sender_id="+session_id;
    console.log("myURL_BERFORE: "+myURL);
    myURL = encodeURI(myURL);
    console.log("myURL_AFTER: "+myURL);
    
    $.ajax({
        url: myURL,
        type: "GET",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log(response.text);
            bot(response.text);
        },
        error: function(){
            console.log("error");
        }
    });
    
    
    
}

function open_close(){
    if ($("#chatroom").is(':visible')) {

        $("#chatroom").addClass("animate__backOutRight");

        $("#chatroom").toggle(function () {
            window.setTimeout(function(){
               $("#chatroom").removeClass("animate__backOutRight")
            }, 1500); 
        });

    } else {
        $("#chatroom").addClass("animate__backInRight");

        $("#chatroom").toggle(function () {
            window.setTimeout(function(){
                $("#chatroom").removeClass("animate__backInRight")
            }, 1500);
        });
    }

}

//function resize(){
//    var iframeHeight = document.getElementById("iframeTag").contentWindow.document.documentElement.scrollHeight;
//}

//編輯個人資訊 START
var userHeadshotURL = "";
$("#headshotBtn").change(function(){
    readURL(this);
});

function readURL(input){
    var reader;
    if(input.files && input.files[0]){
        reader = new FileReader();
        reader.onload = function (e) {
            $("#headshot").attr("src", e.target.result);
            userHeadshotURL = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
      }
}


function save(){
    // 把資料傳給後端
    
    console.log("照片files[0]: "+document.getElementById("headshotBtn").files[0]);
    var userID = localStorage.setItem("sessionID");
    console.log("userID: "+userID);
    let form = new FormData();
    form.append("img", document.getElementById("headshotBtn").files[0], userID);

        fetch('http://127.0.0.1:5000/save_user_img', {
          method: 'POST',
          body: form,
        }).then(result => {
//            var myURL = "http://localhost:5000/upload_image?book_id="+book_id;
//            $.ajax({
//                url: myURL,
//                type: "GET",
//                dataType: "json",
//                async: false,
//                ...
//            });
        });

    
    // 並將新的資訊顯示在螢幕上
    var userHeadshotMenubar = document.getElementById("userHeadshotMenubar");
    var userNameMenubar = document.getElementById("userNameMenubar");
    
    var userHeadshotNav = document.getElementById("userHeadshotNav");
    console.log("userheadshot: "+userHeadshotNav);
    var userNameNav = document.getElementById("userNameNav");
    
    userHeadshotMenubar.setAttribute("src", userHeadshotURL);
    userHeadshotNav.setAttribute("src", userHeadshotURL);
    
    var name = $("#userName").val();
    userNameMenubar.innerHTML = name;
    userNameNav.innerHTML = name;
}
//編輯個人資訊 END

function logOut(){
    localStorage.clear();
    window.location.href = "login.html";
}

window.addEventListener("load", start, false);

window.addEventListener('storage',function(e){
    if(e.key == "page"){//判斷page是否改變
        console.log("page有改變");
        changePage();
    }
    else{
        console.log("是其他的有變～"+e.key);
    }
})