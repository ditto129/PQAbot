////////////// 拿回覆資料＆顯示 START //////////////
function start(){
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
////////////// 拿回覆資料＆顯示 END //////////////

////////////// 編輯回覆 START //////////////
function edit(){
    var postId = localStorage.getItem("singlePostId");
    var replyId = localStorage.getItem("replyId");
    var replierId = localStorage.getItem("sessionID");
    var replierName = localStorage.getItem("userName");
    var response = $("#response").val();
    
    // 時間
    var time = new Date().toJSON();
    time = time.slice(0, 23);
    
    var data = {_id: replyId, post_id: postId, replier_id: replierId, replier_name: replierName, response: response, time: time};
    console.log("傳出去的data資料");
    console.log(data);
    myURL = head_url + "update_inner_post_response";
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log("成功: 編輯回覆（update_inner_post_response）");
            setPage('mySinglePostFrame');
        },
        error: function(response){
            console.log("失敗: 編輯回覆（update_inner_post_response）");
            console.log(response);
            window.alert("編輯回覆 失敗！\n請再試一次");
        }
    });
}
////////////// 編輯回覆 END //////////////

window.addEventListener("load", start, false);