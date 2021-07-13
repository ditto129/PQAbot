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
    //讀取使用者大頭貼＆姓名
    getUserHeadshotAndName();
    
    //興趣標籤 準備
    getLanguageTag();
    
    localStorage.setItem("page", "home");
    changePage();
    
	$(document).ready(function(){
        $('#action_menu_btn').click(function(){
            $('.action_menu').toggle();
        });
    });

    
    //到時候要用session_id
    
    //session_id = window.prompt("請輸入mail的前綴(要用來當session_id)");
//    localStorage.setItem("sessionID", 123);
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

//////////////////照片＆姓名 START////////////////////
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

function getUserHeadshotAndName(){
    
    // 照片
    var id = localStorage.getItem("sessionID");
    var myURL = head_url + "read_image?user_id=" + id;
    var img = "";
    $.ajax({
        url: myURL,
        type: "GET",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log("讀取照片成功");
            img += response;
        },
        error: function(response){
        }
    });
    
    
    // 姓名
    myURL = head_url + "query_user_profile";
    
    var data = {"_id": id};
    var name = "";
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log("成功: 拿姓名（query_user_profile）")
            name += '<span>';
            name += response.name;
            name += '</span>';
        },
        error: function(){
            console.log("失敗: 拿姓名（query_user_profile）");
        }
    });
    
    document.getElementById("userHeadshotMenubar").innerHTML = img;
    document.getElementById("userNameMenubar").innerHTML = name;
    document.getElementById("userProfileNav").innerHTML = img+name;
    
    
    
    
    
}
//////////////////照片＆姓名 END//////////////////////


// 興趣標籤 START
// 用來記使用者選擇的所有標籤
var language = [];
var children = [];
var chosenTags = [];
// 以上3個都是放id
var allTags = {};

//根據chosenTags的內容 顯示已選擇的tags
function showChosenTags(page){
    var chosen_tag_content = "<hr>";
    
    for(var i=0; i<chosenTags.length; i++){
        chosen_tag_content += '<label class="badge purpleLabel" style="margin-right: 5px;">';
            chosen_tag_content += allTags[chosenTags[i]];
        chosen_tag_content += '<button type="button" class="labelXBtn" onclick="cancle(';
        chosen_tag_content += "'";
        chosen_tag_content += chosenTags[i];
        chosen_tag_content += "','";
        chosen_tag_content += page;
        chosen_tag_content += "'";
        chosen_tag_content += ')">x</button></label>';
    }

    document.getElementById("chosen_tag_in_modal").innerHTML = chosen_tag_content;
}

// 顯示可選擇的語言「子」標籤
function click_tag(id, page){
    // tag -> 是選擇了哪個tag
    // page -> 是選語言(0) 還是選孩子(1)
    var tag = allTags[id];
    
    
    // 已選擇的tag START
    
    // card的最下面顯示已選擇的tags
    if(!chosenTags.includes(id)){ //如果還沒選過
        console.log("顯示起來～");
        chosenTags.push(id);
        document.getElementById(id).setAttribute("style", "margin-right: 5px; background-color: #E6E6FA;");
        if(language.indexOf(id)==-1){
            showChosenTags(1);
            console.log("page1");
        }
        else{
            showChosenTags(0);
            console.log("page0");
        }
    }
    // 已選擇的tag END
    
    
    // 可以選擇的標籤 START
    if(page==0){
        
        var myURL = head_url+"query_all_offspring_tag?tag_id="+id;
        children = [];
            $.ajax({
                url: myURL,
                type: "GET",
                async: false, 
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                success: function(response){
                    console.log("success");
                    //先記下allTags 包含名字&ID
                    for(var i=0; i<response.tags.length; i++){
                        console.log("i: "+i);
                        
                        var temp = response.tags[i].tag_name;
                        temp = temp.replace("'", "&apos;");
                        
                        allTags[response.tags[i].tag_id] = temp;
                        children.push(response.tags[i].tag_id);
                    }
                },
                error: function(){
                    console.log("error");
                }
            });
        showChildrenAndSetColor();
    }
    // 可以選擇的標籤 END
}

function showChildrenAndSetColor(){
    localStorage.setItem("chooseTags", 1);
    
    // 標題 START
    // 需加上上一頁的按鈕
    var titleContent = "";
    titleContent += '<i class="fa fa-angle-left scoreBtn" aria-hidden="true" onclick="showLanguageTag()" style="color: gray; margin-right: 5px;"></i>';
    titleContent += "上一頁";
    
    document.getElementById("forwardPage").innerHTML = titleContent;
    // 標題 END
    
    var content = "";
    for(var i=0; i<children.length; i++){
        content += '<label id="';
        content += children[i]; //這裡要放id
        content += '" class="badge purpleLabel2" style="margin-right: 5px;';
        if(chosenTags.indexOf(children[i])!=-1){
            content += 'background-color: #E6E6FA;';
        }
        content += '" onclick="click_tag(';
        content += "'";
        content += children[i];
        content += "', '1'";
        content += ')">';
            content += allTags[children[i]];
        content += "</label>";
    }
    
//    console.log("innerHTML: "+content);
    document.getElementById("chose_tag").innerHTML = content;
}

// 顯示可選擇的語言標籤
function getLanguageTag(){
    
    // 中間內容 START
    // 先去跟後端拿 只有顯示語言的標籤有哪些
    var myURL = head_url+"query_all_languages";
    $.ajax({
        url: myURL,
        type: "GET",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log("success");
            //先記下allTags 包含名字&ID
            for(var i=0; i<response.tags.length; i++){
                language.push(response.tags[0]._id);
                allTags[response.tags[0]._id] = response.tags[0].tag;
                showLanguageTag();
            }
        },
        error: function(){
            console.log("error");
        }
    });
    // 中間內容 END
}

// 顯示「語言」tag的content
function showLanguageTag(){
    localStorage.setItem("chooseTags", 0);
    var content = "";
    for(var i=0; i<language.length; i++){
//        console.log("language.length: "+language.length);
//        console.log("language[i]: "+language[i]);
        content += '<label id="';
        content += language[i];
        content += '" class="badge purpleLabel2" style="margin-right: 5px;';
        //如果選過要變色
        if(chosenTags.indexOf(language[i])!=-1){
            content += 'background-color: #E6E6FA;';
        }
        content += '" onclick="click_tag(';
        content += "'";
        content += language[i];
        content += "', '0'"
        content += ')">';
            content += allTags[language[i]];
        content += '</label>';
    }

    document.getElementById("chose_tag").innerHTML = content;
}

// 取消選擇tag後的處理
function cancle(id, page){
    
    var index = chosenTags.indexOf(id);
    if(index != -1){
        chosenTags.splice(index,1);
        showChosenTags(page);
    }
    
    var temp = parseInt(localStorage.getItem("chooseTags"));
    console.log("page為: "+temp);
    if(temp==0 && language.indexOf(id)==-1){
        showChildrenAndSetColor();
        showLanguageTag();
        localStorage.setItem("chooseTags", 0);
    }
    else if(temp==0 && language.indexOf(id)!=-1){
        showLanguageTag();
    }
    else if(temp==1 && language.indexOf(id)==-1){
        showChildrenAndSetColor();
    }
    else{
        showLanguageTag();
        showChildrenAndSetColor();
        localStorage.setItem("chooseTags", 1);
    }
}
// 興趣標籤 END

function save(){
    // 把資料傳給後端

    var userImgName = localStorage.getItem("sessionID") + ".png";
    let form = new FormData();
    form.append("img", document.getElementById("headshotBtn").files[0], userImgName);
        
    var myURL = head_url + "save_user_img";
    
    fetch(myURL, {
        method: 'POST',
        body: form,
        async: false, 
    }).then(res => {
        return res.json();   // 使用 json() 可以得到 json 物件
    }).then(result => {
        console.log(result); // 得到 {name: "oxxo", age: 18, text: "你的名字是 oxxo，年紀 18 歲～"}
    });
    // 照片的更新
    getUserHeadshot();
    
    // 並將新的資訊顯示在螢幕上

    var userNameMenubar = document.getElementById("userNameMenubar");
    var userNameNav = document.getElementById("userNameNav");
    
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