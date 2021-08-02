var forwardPage = localStorage.getItem("forwardPage");

////////////// 拿回覆資料＆顯示 START //////////////
function showFaqAnswer(){
    document.getElementById("editReplyVote").innerHTML = '<label class="col-sm-2 col-form-label">回覆的分數</label><input class="addFAQsInput col-sm-10" id="answerScore"><br>';
    
    var myURL = head_url + "query_faq_post";
    var postId = localStorage.getItem("singlePostId");
    var data = {"_id": postId};
    var content = "";
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log("成功: 拿單篇貼文（query_inner_post）");
            console.log(response);
            
            var replyId = localStorage.getItem("replyId");
            for(var i=0; i<response.answers.length; i++){
                if(response.answers[i].id == replyId){
                    $("#answerScore").val(response.answers[i].vote);
                    document.getElementById("response").innerHTML = response.answers[i].content;
                    break;
                }
            }
        },
        error: function(){
            console.log("失敗: 拿單篇貼文（query_inner_post）");
        }
    });
}

function showInnerPostAnswer(){
    var myURL = head_url + "query_inner_post";
    var postId = localStorage.getItem("singlePostId");
    var data = {"_id": postId};
    var content = "";
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log("成功: 拿單篇貼文（query_inner_post）");
            console.log(response);
            
            var replyId = localStorage.getItem("replyId");
            for(var i=0; i<response.answer.length; i++){
                if(response.answer[i]._id == replyId){
                    
                    document.getElementById("response").innerHTML = response.answer[i].response;
                    break;
                }
            }
        },
        error: function(){
            console.log("失敗: 拿單篇貼文（query_inner_post）");
        }
    });
}

function start(){
    switch(forwardPage){
        case "FaqFrame":
            showFaqAnswer();
            break;
        case "postRowFrame":
        case "profileFrame":
            showInnerPostAnswer();
            break;
    }
}
////////////// 拿回覆資料＆顯示 END //////////////

////////////// 編輯回覆 START //////////////
function editFaqAnswer(){
    var faqId = localStorage.getItem("singlePostId");
    var answerId = localStorage.getItem("replyId");
    var vote = $("#answerScore").val();
    var response = $("#response").val();
    if(vote=="" && response==""){
        document.getElementById("modalContent").innerHTML = "請輸入回覆的分數 以及 回覆內容";
        $("#note").modal("show");
    }
    else if(vote==""){
        document.getElementById("modalContent").innerHTML = "請輸入回覆的分數";
        $("#note").modal("show");
    }
    else if(response==""){
        document.getElementById("modalContent").innerHTML = "回覆內容";
        $("#note").modal("show");
    }
    else{
        var data = {faq_id: faqId, id: answerId, vote: vote, content: response};
        console.log("data");
        console.log(data);
//        myURL = head_url + "update_faq_answer";
//        $.ajax({
//            url: myURL,
//            type: "POST",
//            data: JSON.stringify(data),
//            async: false,
//            dataType: "json",
//            contentType: 'application/json; charset=utf-8',
//            success: function(response){
//    //            console.log("成功: 編輯回覆（update_inner_post_response）");
//                setPage('mySinglePostFrame');
//            },
//            error: function(response){
//    //            console.log("失敗: 編輯回覆（update_inner_post_response）");
//    //            console.log(response);
//                window.alert("編輯回覆 失敗！\n請再試一次");
//            }
//        });
    }
}

function editInnerPostAnswer(){
    var response = $("#response").val();
    
    if(response == ""){
        document.getElementById("modalContent").innerHTML = "請輸入回覆內容";
        $("#note").modal("show");
    }
    else{
        var postId = localStorage.getItem("singlePostId");
        var replyId = localStorage.getItem("replyId");
        var replierId = localStorage.getItem("sessionID");
        var replierName = localStorage.getItem("userName");
        // 時間
        var time = new Date().toJSON();
        time = time.slice(0, 23);

        var data = {_id: replyId, post_id: postId, replier_id: replierId, replier_name: replierName, response: response, time: time};
    //    console.log("傳出去的data資料");
    //    console.log(data);
        myURL = head_url + "update_inner_post_response";
        $.ajax({
            url: myURL,
            type: "POST",
            data: JSON.stringify(data),
            async: false,
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            success: function(response){
    //            console.log("成功: 編輯回覆（update_inner_post_response）");
                setPage('mySinglePostFrame');
            },
            error: function(response){
    //            console.log("失敗: 編輯回覆（update_inner_post_response）");
    //            console.log(response);
                window.alert("編輯回覆 失敗！\n請再試一次");
            }
        });
    }
}

function edit(){
    switch(forwardPage){
        case "FaqFrame":
            editFaqAnswer();
            break;
        case "postRowFrame":
        case "profileFrame":
            editInnerPostAnswer();
            break;
    }
}
////////////// 編輯回覆 END //////////////

window.addEventListener("load", start, false);