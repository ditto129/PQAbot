var forwardPage;

function save(){
    switch(forwardPage){
        case "FaqFrame":
            addFaqAnswer();
            break;
        case "postRowFrame":
        case "profileFrame":
            addInnerPostAnswer();
            break;
    }
}

function addFaqAnswer(){
    //--- 取得表單資料 START ---//
    var faqId = localStorage.getItem("singlePostId");
    var vote = $("#answerScore").val();
    var content = $("#answerContent").val();
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
        console.log("data: ");
        console.log(data);
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
    var response = $("#answerContent").val();
    
    //true->匿名, false->不是匿名
    var anonymous = document.getElementById('anonymous').checked;
    
    // 時間
    var time = new Date().toJSON();
    time = time.slice(0, 23);
    
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
//    myURL = head_url + "add_post_notification?user_id="+postOwnerId"&replier_name="+replierName+"&post_id="+postId;
//    console.log("myURL: "+myURL);
//    $.ajax({
//        url: myURL,
//        type: "GET",
//        async: false,
//        dataType: "json",
//        contentType: 'application/json; charset=utf-8',
//        success: function(response){
//            console.log("成功: 新增貼文通知（add_post_notification）");
////            setPage('mySinglePostFrame');
//        },
//        error: function(response){
//            console.log("失敗: 新增貼文通知（add_post_notification）");
//            console.log(response);
////            window.alert("回覆貼文 失敗！\n請再試一次");
//        }
//    });
    
    //----- 回覆貼文 -----//
    var data = {post_id: postId, replier_id: replierId, replier_name: replierName, response: response, time: time, incognito: anonymous};
    myURL = head_url + "insert_inner_post_response";
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
//            console.log("成功: 回覆貼文（insert_inner_post_response）");
            setPage('mySinglePostFrame');
        },
        error: function(response){
//            console.log("失敗: 回覆貼文（insert_inner_post_response）");
//            console.log(response);
            window.alert("回覆貼文 失敗！\n請再試一次");
        }
    });
}

function start(){
    forwardPage = localStorage.getItem("forwardPage");
    console.log("forward: "+forwardPage);
    var content = "";
    switch(forwardPage){
        case "FaqFrame":
            content += '<label class="col-sm-2 col-form-label">回覆的分數</label><input class="addFAQsInput col-sm-10" id="answerScore"><br>';
            break;
        case "postRowFrame":
        case "profileFrame":
            content += '<label class="col-sm-2 col-form-label">是否匿名<input id="anonymous" type="checkbox"  data-toggle="toggle" data-size="xs" data-onstyle="secondary" data-width="60" data-height="35" data-on="是" data-off="否"></label>';
            break;
    }
    document.getElementById("replyFirst").innerHTML = content;
}

window.addEventListener("load", start, false);