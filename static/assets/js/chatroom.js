var head_url = "https://835ae8d32fb7.ngrok.io/";
var session_id;

function bot(string){
    console.log("bot送訊息");
    var history = document.getElementById("history_message");
    var content = history.innerHTML;
    content += '<div class="d-flex justify-content-start mb-4">';
        content += '<div class="img_cont_msg">';
                content += '<img src="../static/images/person_1.jpeg" class="rounded-circle user_img_msg">';
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

            content += '<img src="../static/images/person_2.jpeg" class="rounded-circle user_img_msg">';

        content += '</div>';
    content += '</div>';
    
    history.innerHTML = content;
    
    history.scrollTop = history.scrollHeight;
}

//start
function start(){
    
	$(document).ready(function(){
        $('#action_menu_btn').click(function(){
            $('.action_menu').toggle();
        });
    });

    
    //到時候要用session_id
    
    session_id = window.prompt("請輸入mail的前綴(要用來當session_id)");
    console.log("session_id: "+ session_id);
    console.log("head_url: "+head_url);
    
    //傳session_start
    var myURL = head_url + "session_start?sender_id="+session_id;
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
    msg.innerHTML = "";
    console.log("有清空");
    
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
    var chatroom = document.getElementById("chatroom");
    console.log("原本: "+chatroom.getAttribute('class'));
    
    if(chatroom.getAttribute('class') == "card animated backInRight"){
        
        chatroom.setAttribute("class", "card animated backOutRight");
    }
    else{
        chatroom.setAttribute("class", "card animated backInRight");
    }
    console.log("改成: "+chatroom.getAttribute('class'));
    
    $("#chatroom").toggle(function () {
//        if ($("#chatroom").is(':visible')) { //如果是看得到 fadeInUp
//            /* Do "A" */
//            console.log("現在看得到");
//            
//            alert(chatroom.getAttribute('class'));
//            
//        } else {
//            /* Do "B" */
//            console.log("現在看「不」到");
//            
//            alert(chatroom.getAttribute('class'));
//        }
    });
}

window.addEventListener("load", start, false);