function setPage(id, page){
    localStorage.setItem("single_post_id", id);
    localStorage.setItem("page", page);
}

function start(){
    console.log("開始了");
    // 拿到使用者曾發布的貼文 START
    var myURL = head_url + "query_user_profile";
    var id = localStorage.getItem("sessionID");
    var data = {"id": id};
    console.log(data);
    $.ajax({
        url: myURL,
        type: "POST",
        data: data,
//        async: false, 
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log("post成功");
        },
        error: function(){
            console.log("post失敗");
        }
    });
    // 拿到使用者曾發布的貼文 END
}

window.addEventListener("load", start, false);