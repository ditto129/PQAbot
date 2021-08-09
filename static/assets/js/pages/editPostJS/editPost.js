////////// 處理程式碼 START //////////
// 預覽內容
function showReplyContent(why){//why可以是see, save
    var userContent = $("#replyContent").val();
    var storeContent = ""; //要存起來的程式碼
    
    //dotNum 代表有連續幾個`
    //needCouple 是否需要後半段```
    //language 代表程式碼的語言
    var dotNum=0, needCouple=false, language="";
    for(var i=0; i<userContent.length; i++){
        if(userContent[i]=="`"){ //遇到`
            dotNum += 1;
            if(dotNum==3 && needCouple==false){ //湊滿3個 && 是第一次
                
                dotNum = 0;//需要清空`的數量
                
                //先去拿語言
                i += 1;//直接前往下一個index
                var flag = false;
                while(true){
                    if(userContent[i] ==']') break;
                    if(flag==true){
                        language += userContent[i];
                    }
                    if(userContent[i] == '['){
                        flag = true;
                    }
                    i += 1;
                }
                storeContent += '<pre><code class="';
                storeContent += language
                storeContent += '">';
                
                language = "";
                needCouple = true; //代表需要後半段
            }
            else if(dotNum==3 && needCouple==true){ //湊滿3個 && 是第二次
                dotNum = 0;//需要清空`的數量
                needCouple = false;
                
                storeContent += "</code></pre>";
            }
        }
        else{
            storeContent += userContent[i];
        }
    }
    if(why=="see"){
        document.getElementById("previewContent").innerHTML = storeContent;
        hljs.highlightAll();
    }
    else if(why=="save"){
        return storeContent;
    }
    return "";
}

// 新增程式碼區塊
function addCodeArea(){
    console.log("addCodeArea");
    var language = $("select[name='codeLanguage']").val();
    var content = $("#replyContent").val();
    console.log("原本的content: "+content);
    content += '```[';
    content += language;
    content += ']\n```';
    
    $("#replyContent").val(content);
//    setCodeColor();
}
////////// 處理程式碼 END //////////


//_id, title, question, keyword, tag, time, incognito
var userId, postId, title, question, tag, time, incognito;//內部貼文用
var data;//FAQ用
var questionTitle, questionContent;

//var forwardPage = localStorage.getItem("forwardPage");//manageFAQsFram
var postType = localStorage.getItem("postType");

////////////// 拿貼文資料＆顯示 START //////////////
function start(){
    var afterURL;
    switch(postType){
        case "faq":
            afterURL = "query_faq_post";
            break;
        case "innerPost":
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
            
            if(postType=="faq"){
                data = response;
                delete data["keywords"];
                delete data["view_count"];
                questionTitle = data.question.title;
                questionContent = data.question.edit;
//                console.log("拿到的data: ");
//                console.log(data);
            }
            else{
                keyword = response.keyword;
                tag = response.tag;
                incognito = response.incognito;
                
                questionTitle = response.title;
                questionContent = response.edit;
            }
            
            document.getElementById("title").setAttribute("value", questionTitle);
            document.getElementById("replyContent").innerHTML = questionContent;
        },
        error: function(){
//            console.log("失敗: 拿單篇貼文（query_inner_post）");
        }
    });
}
////////////// 拿貼文資料＆顯示 END //////////////


////////////// 儲存貼文 START //////////////
function save(){
    console.log("儲存前faq: ");
    console.log(data);
    postId = localStorage.getItem("singlePostId");
    userId = localStorage.getItem("sessionID");
    title = $("#title").val();
//    question = $("#question").val();
    question = showReplyContent("save");
    var edit = $("#replyContent").val();
    // 時間
    time = new Date().toJSON();
    time = time.slice(0, 23);
    
    var myURL, afterURL;
    switch(postType){
        case "faq":
            afterURL = "update_faq_post";
            var time = new Date().toJSON();
            time = time.slice(0, 23);
            data["time"] = time;
            data["question"].title = title;
            data["question"].content = question;
            data["question"].edit = edit;
            break;
        case "innerPost":
            afterURL = "update_inner_post";
            data = {asker_id: userId, _id: postId, title: title, question: question, edit: edit, time: time};
            break;
    }
    console.log("傳出去的");
    console.log(data);
    
    myURL = head_url + afterURL;
    console.log("myURL: "+myURL);
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
//            console.log("成功: 編輯貼文");
            console.log(response);
//            setPage('mySinglePostFrame');
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