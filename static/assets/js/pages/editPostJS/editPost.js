//_id, title, question, keyword, tag, time, incognito
var postId, title, question, tag, time, incognito;

////////////// 拿貼文資料＆顯示 START //////////////
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
            
            keyword = response.keyword;
            tag = response.tag;
            incognito = response.incognito;
            
            document.getElementById("title").setAttribute("value", response.title);
            document.getElementById("question").innerHTML = response.question;
        },
        error: function(){
            console.log("失敗: 拿單篇貼文（query_inner_post）");
        }
    });
}
////////////// 拿貼文資料＆顯示 END //////////////


////////////// 儲存貼文 START //////////////
function save(){
    postId = localStorage.getItem("singlePostId");
    title = $("#title").val();
    question = $("#question").val();
    time = new Date();
    
    var data = {"_id": postId, "title": title, "question": question, "keyword": [], "tag": tag, "time": time, "incognito": incognito};
    console.log(data);
    
    var myURL = head_url + "update_inner_post";
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log("成功: 編輯貼文（update_inner_post）");
            setPage('mySinglePostFrame');
        },
        error: function(response){
            console.log("失敗: 編輯貼文（update_inner_post）");
            console.log(response);
            window.alert("發布貼文 失敗！\n請再試一次");
        }
    });
}
////////////// 儲存貼文 END //////////////

window.addEventListener("load", start, false);