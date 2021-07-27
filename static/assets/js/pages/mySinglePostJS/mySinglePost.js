var pageNumber = 1;

function setLocalStorage(id){
    localStorage.setItem("replyId", id);
    setPage('editReplyFrame');
}

/////////////// 刪除貼文 START ///////////////
function deletePost(){
    
    var singlePostId = localStorage.getItem("singlePostId");
    console.log("singlePostId: "+singlePostId);
    
    var data = {_id: singlePostId};
    console.log(data);

    var myURL = head_url + "delete_inner_post";
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log("成功: 刪除貼文（delete_inner_post）");
            console.log(response);
            localStorage.removeItem('singlePostId');
            setPage(localStorage.getItem("forwardPage"));
        },
        error: function(response){
            console.log("失敗: 刪除貼文（delete_inner_post）");
            console.log(response);
        }
    });
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
function start(){
    
    var userId = localStorage.getItem("sessionID");
    
    var myURL = head_url + "query_inner_post";
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
            console.log("成功: 拿單篇貼文（query_inner_post）");
            console.log(response);
            
            content += '<div class="title">問題</div>';
            if(response.asker_id == localStorage.getItem("sessionID")){
                // 編輯
                content += '<button type="button" class="scoreBtn" onclick="setPage(';
                content += "'editPostFrame'";
                content += ')"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>';
            }
            if(response.asker_id == localStorage.getItem("sessionID") || localStorage.getItem("role")=="manager"){
               // 刪除
                content += '<button type="button" class="scoreBtn" data-toggle="modal" data-target="#exampleModal"><i class="fa fa-trash-o" aria-hidden="true"></i></button>';
            }
            document.getElementById("header").innerHTML = content;
            
            var id = response._id;
            var title = response.title;
            var question = response.question;
            var tag = response.tag;
            var time = new Date(response.time);
            time = time.toISOString();
            time = time.slice(0, 10);
            var score = 0;
            for(var i=0; i<response.score.length; i++){
                score += response.score[i].score;
            }
            console.log("Score: "+score);
            
            
            content = "";
            content += '<div class="badge-box">';
                content += '<div class="sub-title">';
                    content += '<span>';
                    if(response.incognito==true){
                        content += "匿名";
                    }
                    else{
                        content += response.asker_name;
                    }
                    content += '</span>';
                
                    content += '<span id="';
                    content += response._id;
                    content += 'Score" style="float:right;"><i class="fa fa-trophy" aria-hidden="true"></i>';
                    content += score;
                    content += '</span>';
                content += '</div>';
                
                content += '<div>';
                    content += '<span><h5>';
                    content += title;
                    content += '</h5></span>';
            
                content += '<div>';
                    content += '<span>';
                    question = question.replaceAll('\n', '<br>');
                    console.log("question: "+question);
                    content += question;
                    content += '</span>';
                content += '</div>';
                
                content += '<div style="margin-top: 20px;">';
                for(var i=0; i<tag.length; i++){
                    content += '<label class="badge badge-default purpleLabel">';
                        content += tag[i].tag_name;
                    content += '</label>';
                }
                content += '</div>';
                
                content += '<div>';
                    content += '<label class="badge purpleLabel2">';
                    content += time;
                    content += '</label>';
                    
                    content += '<div style="float:right;">';
                        content += '<button type="button" class="scoreBtn" onclick="thumbs(';
                        content += "'1', '', '";
                        content += response.asker_id;
                        content += "')";
                        content += '">';
            
                        // 檢查有沒有按讚 START
                        var temp = {score: 1, user_id: userId};
                        console.log(temp);
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
                        // 檢查有沒有按讚 END
                        
                        content += '</button>';

                        content += '<button type="button" class="scoreBtn" onclick="thumbs(';
                        content += "'-1', '', '";
                        content += response.asker_id;
                        content += "')";
                        content += '">';
            
                        // 檢查有沒有按倒讚 START
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
                        // 檢查有沒有按倒讚 END
                        
                        content += '</button>';
                    content += '</div>';
                content += '</div>';
            content += '</div>';
            
            document.getElementById("question").innerHTML = content;
            
            content = "";
            response.answer.sort(function(a, b){
                return a.time < b.time ? 1 : -1;
            });
            
            if(response.answer.length == 0){
                content += '<div class="title">目前暫無回答</div>';
            }
            for(var i=0; i<response.answer.length; i++){
                var score = 0;
                for(var j=0; j<response.answer[i].score.length; j++){
                    score += response.answer[i].score[j].score;
                }
                content += '<div class="col-12">';
                    content += '<div class="badge-box">';
                        content += '<div class="sub-title">';
                            content += '<span>';
                                if(response.answer[i].incognito == true){
                                    content += "匿名";
                                }
                                else{
                                    content += response.answer[i].replier_name;
                                }
                            content += '</span>';
                
                            if(response.answer[i].replier_id == localStorage.getItem("sessionID")){
                            content += '<button type="button" class="scoreBtn" onclick="setLocalStorage(';
                            content += "'";
                            content += response.answer[i]._id;
                            content += "'";
                            content += ')"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>';
                        }
                            
                            content += '<span id="';
                            content += response.answer[i]._id;
                            content += 'Score" style="float:right;"><i class="fa fa-trophy" aria-hidden="true"></i>';
                                content += score;
                            content += '</span>';
                        content += '</div>';
                        
                        content += '<span>';
                            content += response.answer[i].response.replaceAll('\n', '<br>');
                        content += '</span>';
//                        <span><br><code>hello world</code></span>
                        
                        content += '<div style="margin-top: 20px;">';
                            content += '<label class="badge purpleLabel2">';
                                var time = new Date(response.answer[i].time);
                                time = time.toISOString();
                                content += time.slice(0, 10);
                            content += '</label>';
                
                            content += '<div style="float:right;">';
                                content += '<button type="button" class="scoreBtn" onclick="thumbs(';
                                content += "'1', '";
                                content += response.answer[i]._id;
                                content += "', '";
                                content += response.answer[i].replier_id;
                                content += "')";
                                content += '">';
                
                                // 檢查有沒有按讚 START
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
                            content += '</div>';
                        content += '</div>';
                    content += '</div>';
                content += '</div>';
            }
            
            document.getElementById("response").innerHTML = content;
        },
        error: function(){
            console.log("失敗: 拿單篇貼文（query_inner_post）");
        }
    });
    
    if(localStorage.getItem("role")=="generalUser"){
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