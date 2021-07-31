var pageNumber = 1;
var forwardPage;

function setLocalStorage(id){
    localStorage.setItem("replyId", id);
    setPage('editReplyFrame');
}

/////////////// 刪除貼文 START ///////////////
function deletePost(){
    var afterURL;
    //----- 檢查是哪種貼文（faq vs inner） START -----//
    switch(forwardPage){
        case "postRowFrame":
        case "profileFrame":
            afterURL = "delete_inner_post";
            break;
        case "manageFAQsFrame":
            afterURL = "delete_faq_post";
            break;
    }
    //----- 檢查是哪種貼文（faq vs inner） END -----//
    //delete_faq_post
    var singlePostId = localStorage.getItem("singlePostId");
//    console.log("singlePostId: "+singlePostId);
    
    var data = {_id: singlePostId};
//    console.log(data);

    var myURL = head_url + afterURL;
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
//            console.log("成功: 刪除貼文");
//            console.log(response);
            localStorage.removeItem('singlePostId');
            setPage(forwardPage);
        },
        error: function(response){
//            console.log("失敗: 刪除貼文");
//            console.log(response);
        }
    });
}

function wantDeleteAnswer(answerId){
    document.getElementById("exampleModalLabel").innerHTML = "刪除回覆";
    $("#exampleModal").modal('show');
    
    
    console.log("answerId: "+answerId);
    //接刪除回覆的API
}
///////////////  刪除貼文 END ///////////////


/////////////// 檢查是否按過讚、倒讚 START ///////////////
function objectInArrayThumb(obj, arr){//score, user_id
    for(var i=0; i<arr.length; i++){
        if(obj.score == arr[i].score && obj.user_id == arr[i].user_id){
            return true;
        }
    }
    return false;
}
///////////////  檢查是否按過讚、倒讚 END ///////////////


/////////////// 對貼文或回覆按讚、倒讚 START ///////////////
function thumbs(score, replyId, targetUserId){
    var postId = localStorage.getItem("singlePostId");
    var userId = localStorage.getItem("sessionID");
    var data = {post_id: postId, response_id: replyId, user: userId, target_user: targetUserId};
    console.log(data);
    var myURL;
    
    if(score == 1){
        myURL = head_url + "like_inner_post";
    }
    else{
        myURL = head_url + "dislike_inner_post";
    }
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log("成功: 對貼文/回覆評分（like_inner_post/dislike_inner_post）");
            window.location.reload();
        },
        error: function(response){
            console.log("失敗: 對貼文/回覆評分（like_inner_post/dislike_inner_post）");
            console.log(response);
        }
    });
}
///////////////  對貼文或回覆按讚、倒讚 END ///////////////


/////////////// 抓初始資料 START ///////////////
function showQuestion(response){
//    console.log(response);
    var postCharacteristic, title, question, tags, modalTitle;
    //----- 檢查是哪種貼文（faq vs inner） START -----//
    switch(forwardPage){
        case "postRowFrame":
        case "profileFrame":
            postCharacteristic = "innerPost";
            title = response.title;
            question = response.question;
            tags = response.tag;
            modalTitle = "刪除貼文";
            break;
        case "manageFAQsFrame":
            postCharacteristic = "faqPost";
            title = response.question.title;
            question = response.question.content;
            tags = response.tags;
            modalTitle = "刪除FAQ";
            break;
    }
    document.getElementById("exampleModalLabel").innerHTML = modalTitle;
    //----- 檢查是哪種貼文（faq vs inner） END -----//
    
    var id = response._id;
    var time = new Date(response.time);
    time = time.toISOString();
    time = time.slice(0, 10);


    content = "";
    content += '<div class="badge-box">';
        content += '<div class="sub-title">';
            
            //----- 貼文ID or 發文者 START -----//
            content += '<span>';
            if(response.incognito==true){
                content += "匿名";
            }
            else if(postCharacteristic=="innerPost"){
                content += response.asker_name;
            }
            else if(postCharacteristic=="faqPost"){
                content += "FAQ的ID #";
                content += id;
            }
            content += '</span>';
            //----- 貼文ID or 發文者 END -----//
            
            //----- 分數 START -----//
            var qusetionScore = 0;
            if(postCharacteristic=="innerPost"){
                for(var i=0; i<response.score.length; i++){
                    qusetionScore += response.score[i].score;
                }
            }
            else if(postCharacteristic=="faqPost"){
                for(var i=0; i<response.question.score.length; i++){
                    qusetionScore += response.score[i].score;
                }
            }
            content += '<span id="';
            content += response._id;
            content += 'Score" style="float:right;"><i class="fa fa-trophy" aria-hidden="true"></i>';
            content += qusetionScore;
            content += '</span>';
            //----- 分數 END -----//
        content += '</div>';

        content += '<div>';
            //----- 貼文標題 START -----//
            content += '<span><h5>';
            content += title;
            content += '</h5></span>';
            //----- 貼文標題 END -----//

            //----- 貼文內容 START -----//
            content += '<div>';
                content += '<span>';
                question = question.replaceAll('\n', '<br>');
                content += question;
                content += '</span>';
            content += '</div>';
            //----- 貼文內容 END -----//
            
            //----- 貼文TAGs START -----//
            content += '<div style="margin-top: 20px;">';
            for(var i=0; i<tags.length; i++){
                content += '<label class="badge badge-default purpleLabel">';
                    content += tags[i].tag_name;
                content += '</label>';
            }
            content += '</div>';
            //----- 貼文TAGs END -----//

        content += '<div>';
            //----- 貼文時間 START -----//
            content += '<label class="badge purpleLabel2">';
            content += time;
            content += '</label>';
            //----- 貼文時間 END -----//

            

                if(postCharacteristic=="innerPost"){
                    var userId = sessionStorage.getItem("sessionID");
                    //----- 檢查有沒有按讚 START -----//
                    content += '<div style="float:right;">';
                    content += '<button type="button" class="scoreBtn" onclick="thumbs(';
                    content += "'1', '', '";
                    content += response.asker_id;
                    content += "')";
                    content += '">';
                    var userId = localStorage.getItem("sessionID");
                    var temp = {score: 1, user_id: userId};
                    if(objectInArrayThumb(temp, response.score)){
                        content += '<i id="';
                        content += response._id;
                        content += '" class="fa fa-thumbs-up" aria-hidden="true"></i>';
                    }
                    else{
                        content += '<i id="';
                        content += response._id;
                        content += '" class="fa fa-thumbs-o-up" aria-hidden="true"></i>';
                    }
                    
                    content += '</button>';
                    //----- 檢查有沒有按讚 END -----//
                    
                    
                    //----- 檢查有沒有倒讚 START -----//
                    content += '<button type="button" class="scoreBtn" onclick="thumbs(';
                    content += "'-1', '', '";
                    content += response.asker_id;
                    content += "')";
                    content += '">';

                    var temp = {score: -1, user_id: userId};
                    if(objectInArrayThumb(temp, response.score)){
                        content += '<i id="';
                        content += response._id;
                        content += '" class="fa fa-thumbs-down" aria-hidden="true"></i>';
                    }
                    else{
                        content += '<i id="';
                        content += response._id;
                        content += '" class="fa fa-thumbs-o-down" aria-hidden="true"></i>';
                    }
                    content += '</button>';
                    //----- 檢查有沒有倒讚 END -----//
                }
            content += '</div>';
        content += '</div>';
    content += '</div>';

    document.getElementById("question").innerHTML = content;
}

function showAnswers(response){
    console.log("回覆貼文");
    console.log(response);
    content = "";
    var tempAnswerLength;
    switch(forwardPage){
        case "postRowFrame":
        case "profileFrame":
            response.answer.sort(function(a, b){
                return a.time < b.time ? 1 : -1;
            });
            tempAnswerLength = response.answer.length;
            break;
        case "manageFAQsFrame":
            tempAnswerLength = response.answers.length;
            break;
    }
    
    if(tempAnswerLength==0){
        content += '<div class="title card-header">目前暫無回答</div>';
    }
    for(var i=0; i<tempAnswerLength; i++){
        
        var answerTitle, answerContent, answerTime, answerScore=0, answerId;
        switch(forwardPage){
            case "postRowFrame":
            case "profileFrame":
                if(response.answer[i].incognito == true){
                    answerTitle = "匿名";
                }
                else{
                    answerTitle = response.answer[i].replier_name;
                }
                answerContent = response.answer[i].response.replaceAll('\n', '<br>');
                answerTime = new Date(response.answer[i].time);
                answerTime = answerTime.toISOString();
                answerTime = answerTime.slice(0, 10);
                for(var j=0; j<response.answer[i].score.length; j++){
                    answerScore += response.answer[i].score[j].score;
                }
                answerId = response.answer[i]._id;
                break;
            case "manageFAQsFrame":
                answerTitle = "回覆的ID #" + response.answers[i]._id;
                answerContent = response.answers[i].content.replaceAll('\n', '<br>');
                answerTime = new Date(response.time);
                answerTime = answerTime.toISOString();
                answerTime = answerTime.slice(0, 10);
                for(var j=0; j<response.answers[i].score.length; j++){
                    answerScore += response.answers[i].score[j].score;
                }
                answerId = response.answers[i]._id;
                break;
        }
        
        
        content += '<div class="col-12">';
            content += '<div class="badge-box">';
                content += '<div class="sub-title">';
                    content += '<span>';
                        content += answerTitle;
                    content += '</span>';

                    //----- 編輯、刪除按鈕 START -----//
                    if(forwardPage=="manageFAQsFrame" || response.answer[i].replier_id == localStorage.getItem("sessionID")){
                        content += '<button type="button" class="scoreBtn" onclick="setLocalStorage(';
                        content += "'";
                        content += answerId;
                        content += "'";
                        content += ')"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>';
                        content += '<button type="button" class="scoreBtn" onclick="wantDeleteAnswer(\'';
                        content += answerId;
                        content += '\')"><i class="fa fa-trash-o" aria-hidden="true"></i></button>';
                    }
                    //----- 編輯、刪除按鈕 END -----//
                    
                    //----- 回覆分數 START -----//
                    content += '<span id="';
                    content += answerId;
                    content += 'Score" style="float:right;"><i class="fa fa-trophy" aria-hidden="true"></i>';
                        content += answerScore;
                    content += '</span>';
                    //----- 回覆分數 END -----//
                content += '</div>';

                content += '<span>';
                    content += answerContent;
                content += '</span>';
//                        <span><br><code>hello world</code></span>

                content += '<div style="margin-top: 20px;">';
                    content += '<label class="badge purpleLabel2">';
                        content += answerTime;
                    content += '</label>';

                    if(forwardPage=="postRowFrame" || forwardPage=="profileFrame"){
                        var userId = localStorage.getItem("sessionID");
                       // 檢查有沒有按讚 START //
                        content += '<div style="float:right;">';
                        content += '<button type="button" class="scoreBtn" onclick="thumbs(';
                        content += "'1', '";
                        content += response.answer[i]._id;
                        content += "', '";
                        content += response.answer[i].replier_id;
                        content += "')";
                        content += '">';

                        var temp = {score: 1, user_id: userId};
                        if(objectInArrayThumb(temp, response.answer[i].score)){
                            content += '<i id="';
                            content += response.answer[i]._id;
                            content += '" class="fa fa-thumbs-up" aria-hidden="true"></i>';
                        }
                        else{
                            content += '<i id="';
                            content += response.answer[i]._id;
                            content += '" class="fa fa-thumbs-o-up" aria-hidden="true"></i>';
                        }
                        // 檢查有沒有按讚 END


                        content += '</button>';

                        content += '<button type="button" class="scoreBtn" onclick="thumbs(';
                        content += "'-1', '";
                        content += response.answer[i]._id;
                        content += "', '";
                        content += response.answer[i].replier_id;
                        content += "')";
                        content += '">';

                        // 檢查有沒有按倒讚 START
                        var temp = {score: -1, user_id: userId};
                        console.log("有沒有按倒讚: "+objectInArrayThumb(temp, answerScore));
                        if(objectInArrayThumb(temp, response.answer[i].score)){
                            content += '<i id="';
                            content += response.answer[i]._id;
                            content += '" class="fa fa-thumbs-down" aria-hidden="true"></i>';
                        }
                        else{
                            content += '<i id="';
                            content += response.answer[i]._id;
                            content += '" class="fa fa-thumbs-o-down" aria-hidden="true"></i>';
                        }
                        // 檢查有沒有按倒讚 END

                        content += '</button>';
                    }
                    content += '</div>';
                content += '</div>';
            content += '</div>';
        content += '</div>';
    }

    document.getElementById("response").innerHTML = content;
}

function start(){
    var userId = localStorage.getItem("sessionID");
    var afterURL;
    forwardPage = localStorage.getItem("forwardPage");
    switch(forwardPage){
        case "postRowFrame":
        case "profileFrame":
            afterURL = "query_inner_post";
            break;
        case "manageFAQsFrame":
            afterURL = "query_faq_post";
            break;
    }
    var myURL = head_url + afterURL;
    console.log("START: "+myURL);
    var singlePostId = localStorage.getItem("singlePostId");
    var data = {"_id": singlePostId};
    var content = "";
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
//            console.log("成功: 拿單篇貼文");
//            console.log(response);

            //----- 顯示問題 START -----//
            content += '<div class="title">問題</div>';
            // ----- 編輯按鈕 -----//
            if(response.asker_id == localStorage.getItem("sessionID") || afterURL == "query_faq_post"){
                // 編輯
                content += '<button type="button" class="scoreBtn" onclick="setPage(';
                content += "'editPostFrame'";
                content += ')"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>';
            }
            
            // ----- 刪除按鈕 -----//
            if(response.asker_id == userId || localStorage.getItem("role")=="manager"){
               // 刪除
                content += '<button type="button" class="scoreBtn" data-toggle="modal" data-target="#exampleModal"><i class="fa fa-trash-o" aria-hidden="true"></i></button>';
            }
            document.getElementById("header").innerHTML = content;
            
            showQuestion(response);
            //----- 顯示問題 END -----//
            
            //----- 顯示答案 START -----//
            switch(forwardPage){
                case "postRowFrame":
                case "profileFrame":
                    showAnswers(response);
                    break;
                case "manageFAQsFrame":
                    showAnswers(response);
                    break;
            }
            //----- 顯示答案 END -----//
        },
        error: function(){
//            console.log("失敗: 拿單篇貼文（query_inner_post）");
        }
    });
    
    // 內部貼文全部都可以回覆
    // FAQ只有管理者可以回覆
    if(localStorage.getItem("role")=="generalUser" || (localStorage.getItem("role")=="manager" && forwardPage=="manageFAQsFrame")){
        content = "";
        content += ''
        content += '<button type="button" class="scoreBtn" onclick="setPage(\'replyQuestionFrame\')">';
            content += '<i class="fa fa-plus" aria-hidden="true"></i>';
        content += '</button>';
        document.getElementById("answerButton").innerHTML = content;
    }
}
///////////////  抓初始資料 END ///////////////

window.addEventListener("load", start, false);