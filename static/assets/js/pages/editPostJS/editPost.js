//_id, title, question, keyword, tag, time, incognito
var userId, postId, title, question, tag, time, incognito;//內部貼文用
var data;//FAQ用
var questionTitle, questionContent;

var forwardPage = localStorage.getItem("forwardPage");//manageFAQsFrame

////////////// 拿貼文資料＆顯示 START //////////////
function start(){
    var afterURL;
    switch(forwardPage){
        case "FaqFrame":
            afterURL = "query_faq_post";
            break;
        default:
            afterURL = "query_inner_post";
            break;
    }
    var myURL = head_url + afterURL;
    var postId = localStorage.getItem("singlePostId");
    data = {"_id": postId};
    var content = "";
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
//            console.log("成功: 拿單篇貼文（query_inner_post）");
//            console.log(response);
            
            if(forwardPage=="FaqFrame"){
                data = response;
                delete data["keywords"];
                delete data["view_count"];
                questionTitle = data.question.title;
                questionContent = data.question.content;
//                console.log("拿到的data: ");
//                console.log(data);
            }
            else{
                keyword = response.keyword;
                tag = response.tag;
                incognito = response.incognito;
                
                questionTitle = response.title;
                questionContent = response.question;
            }
            
            document.getElementById("title").setAttribute("value", questionTitle);
            document.getElementById("question").innerHTML = questionContent;
        },
        error: function(){
//            console.log("失敗: 拿單篇貼文（query_inner_post）");
        }
    });
}
////////////// 拿貼文資料＆顯示 END //////////////


////////////// 儲存貼文 START //////////////
function save(){
    postId = localStorage.getItem("singlePostId");
    userId = localStorage.getItem("sessionID");
    title = $("#title").val();
    question = $("#question").val();
    // 時間
    time = new Date().toJSON();
    time = time.slice(0, 23);
    
    var myURL, afterURL;
    switch(forwardPage){
        case "FaqFrame":
            afterURL = "update_faq_post";
            var time = new Date().toJSON();
            time = time.slice(0, 23);
            data["time"] = time;
            data["question"].title = title;
            data["question"].content = question;
            break;
        default:
            afterURL = "update_inner_post";
            data = {asker_id: userId, _id: postId, title: title, question: question, time: time};
            break;
    }
//    console.log("傳出去的");
//    console.log(data);
    
    myURL = head_url + afterURL;
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
//            console.log("成功: 編輯貼文");
//            console.log(response);
            setPage('mySinglePostFrame');
        },
        error: function(response){
//            console.log("失敗: 編輯");
//            console.log(response);
            window.alert("編輯失敗！\n請再試一次");
        }
    });
}
////////////// 儲存貼文 END //////////////

window.addEventListener("load", start, false);