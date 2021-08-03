var postType;
 
function setCodeColor(){
    hljs.highlightAll();
}

function addCodeArea(){
    console.log("lan: "+$("#language").val());
    var language = $("#language").val();
    var content = document.getElementById("replyContent").innerHTML;
    content += '<pre><code class="';
    content += language;
    content += '">';
//    content += 'print("hello world")\n';
//    content += 't = input()';
    content += '</code></pre>';
    
    document.getElementById("replyContent").innerHTML = content;
    setCodeColor();
}

function save(){
    var allstring = document.getElementById("test-editormd");
//    var cln = allstring.cloneNode(true);
//    $('#contentText').val();
    console.log("值: "+$('#contentText').val());
    $('#contentText'). remove();
//    console.log("透過id抓: "+document.getElementById("contentText"));
//    allstring.getElementById("contentText").remove();
    console.log("內容是: " + allstring.innerHTML);
//    var allString = document.getElementById("test-editormd");
//    console.log("全部的內容: "+allString.innerHTML);
//    
//    var pureString = document.getElementsByTagName("textarea")[0];
//    console.log("textarea的區塊: "+pureString.innerHTML);
//    console.log("textarea的內容: "+pureString.value);
    
//    var temp = allString.innerHTML.replace(pureString.value, "");
//    console.log("傳給灣龍的code: "+temp);
    
    // 先刪掉textarea
    // 傳後面的
//    var reg = /^<textarea|$<\/textarea>/;
//    var deleteTextarea = document.getElementById("test-editormd").innerHTML;
//    deleteTextarea = deleteTextarea.replace(reg, "");
//    console.log("刪掉textarea: "+deleteTextarea);
    switch(postType){
        case "faq":
            addFaqAnswer();
            break;
        case "innerPost":
            addInnerPostAnswer();
            break;
    }
}

function addFaqAnswer(){
    //--- 取得表單資料 START ---//
    var faqId = localStorage.getItem("singlePostId");
    var vote = $("#answerScore").val();
    var content = document.getElementsByTagName("textarea")[0].value;
    if(vote=="" && content==""){
        document.getElementById("modalContent").innerHTML="請輸入回覆的分數 以及 回覆內容";
        $("#note").modal("show");
    }
    else if(vote==""){
        document.getElementById("modalContent").innerHTML="請輸入回覆的分數";
        $("#note").modal("show");
    }
    else if(content==""){
        document.getElementById("modalContent").innerHTML="請輸入回覆內容";
        $("#note").modal("show");
    }
    else{
        var data = {faq_id: faqId, vote: vote, content: content};
//        console.log("data: ");
//        console.log(data);
        //--- 取得表單資料 END ---//

        //--- 呼叫API START ---//
        var myURL = head_url+"insert_faq_answer";
        $.ajax({
            url: myURL,
            type: "POST",
            data: JSON.stringify(data),
            async: false,
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            success: function(response){
//                console.log("成功: 回覆Faq（insert_faq_answer）");
//                console.log(response);
                setPage('mySinglePostFrame');
            },
            error: function(response){
                window.alert("回覆FAQ 失敗！\n請再試一次");
            }
        });
        //--- 呼叫API START ---//
    }
}

function addInnerPostAnswer(){
    var myURL, data;
    var postId = localStorage.getItem("singlePostId");
    var postOwnerId;
    var replierId = localStorage.getItem("sessionID");
    var replierName = localStorage.getItem("userName");
//    var response = document.getElementsByTagName("textarea")[0].value;
    //---
    var allstring = document.getElementById("test-editormd");
    console.log("值: "+$('#contentText').val());
    $('#contentText'). remove();
    console.log("內容是: " + allstring.innerHTML);
    var previewMarkdown = document.getElementsByClassName("editormd-preview");
    console.log("預覽畫面是: "+previewMarkdown[0].innerHTML);
    
    //---
//    var response = document.getElementById("test-editormd").innerHTML;
//    var response = allstring.innerHTML; //全部的
    var response = previewMarkdown[0].innerHTML;
    
    //true->匿名, false->不是匿名
    var anonymous = document.getElementById('anonymous').checked;
    
    // 時間
    var time = dateToString(new Date());
//    console.log("儲存時間: "+time);
    
    myURL = head_url + "query_inner_post";
    data = {_id: postId};
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
//            console.log(response);
            postOwnerId = response.asker_id;
        },
        error: function(response){
//            console.log("error:");
//            console.log(response);
        }
    });
    
    //----- 為了處理通知 更新資料庫 -----//
    myURL = head_url + "add_post_notification?user_id="+postOwnerId+"&replier_name="+replierName+"&post_id="+postId;
//    console.log("myURL: "+myURL);
    $.ajax({
        url: myURL,
        type: "GET",
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
//            console.log("成功: 新增貼文通知（add_post_notification）");
            setPage('mySinglePostFrame');
        },
        error: function(response){
//            console.log("失敗: 新增貼文通知（add_post_notification）");
//            console.log(response);
            window.alert("回覆貼文 失敗！\n請再試一次");
        }
    });
    
    //----- 回覆貼文 -----//
    var data = {post_id: postId, replier_id: replierId, replier_name: replierName, response: response, time: time, incognito: anonymous};
    console.log("回覆innerPost");
    console.log(data);
    myURL = head_url + "insert_inner_post_response";
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log(response);
            setPage('mySinglePostFrame');
        },
        error: function(response){
            console.log("失敗: 回覆貼文（insert_inner_post_response）");
            console.log(response);
            window.alert("回覆貼文 失敗！\n請再試一次");
        }
    });
}

function start(){
    postType = localStorage.getItem("postType");
    var content = "";
    switch(postType){
        case "faq":
            content += '<label class="col-sm-2 col-form-label">回覆的分數</label><input class="addFAQsInput col-sm-10" id="answerScore"><br>';
            break;
        case "innerPost":
            content += '<label class="col-sm-2 col-form-label">是否匿名<input id="anonymous" type="checkbox"  data-toggle="toggle" data-size="xs" data-onstyle="secondary" data-width="60" data-height="35" data-on="是" data-off="否"></label>';
            break;
    }
    document.getElementById("replyFirst").innerHTML = content;
}



window.addEventListener("load", function(){
    start();
}, false);