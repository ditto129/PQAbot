function setLocalStorage(id){
    localStorage.setItem("forwardPage", "profileFrame");
    localStorage.setItem("singlePostId", id);
    setPage('mySinglePostFrame');
}

function start(){
    
    // 拿到使用者曾發布的貼文 START
    var myURL = head_url + "query_user_post_list";
    var id = localStorage.getItem("sessionID");
    var data = {"_id": id};
    var content = "";
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log("成功: 拿貼文紀錄（query_user_post_list）");
            
            // 把拿到的資料 從新到舊排序
            response.sort(function(a, b){
                return new Date(a.time) < new Date(b.time) ? 1 : -1;
            });
            
            console.log(response);
            
            for(var i=0; i<response.length; i++){
                var postId = response[i]._id;
                var title = response[i].title;
                var tag = response[i].tag;
                var time = new Date(response[i].time).toISOString();
                time = time.slice(0, 10);
                var score = 0;
                
                for(var j=0; j<response[i].score.length; j++){
                    score += response[i].score[j].score;
                }
                
                content += '<div class="col-lg-4 col-xl-3 col-sm-12">';
                content += '<a href="#" onclick="setLocalStorage(';
                content += "'";
                content += postId;
                content += "')";
                content += '">';
                
                    content += '<div class="badge-box">';
                        content += '<div class="sub-title">';
                            content += '<span>貼文 ';
                            content += postId;
                            content += '</span>';
                
                            content += '<span style="float:right;"><i class="fa fa-trophy" aria-hidden="true"></i>';
                            content += score;
                            content += '</span>';
                        content += '</div>';
                
                        content += '<div>';
                            content += title;
                        content += '</div>';
                
                        content += '<div style="margin-top: 20px;">';
                            for(var j=0; j<tag.length; j++){
                                content += '<label class="badge badge-default purpleLabel">';
                                    content += tag[j].tag_name;
                                content += '</label>';
                            }
                        
                            content += '<div>';
                                content += '<label class="badge purpleLabel2">';
                                    content += time;
                                content += '</label>';
                            content += '</div>';
                        
                        content += '</div>';
                
                    content += '</div>';
                content += '</a>';
                content += '</div>';
            }

        },
        error: function(){
            console.log("失敗: 拿貼文紀錄（query_user_post_list）");
        }
    });
    
    document.getElementById("post").innerHTML = content;
    // 拿到使用者曾發布的貼文 END
    
    
    // 拿到使用者曾回覆的貼文 START
    var responsePostId = [];
    myURL = head_url + "query_user_response_list";
    content = "";
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log("成功: 拿回覆紀錄（query_user_response_list）");
            // 把拿到的資料 從新到舊排序
            response.sort(function(a, b){
                return new Date(a.time) < new Date(b.time) ? 1 : -1;
            });
            console.log(response);
            
            for(var i=0; i<response.length; i++){
                var postId = response[i]._id;
                if(responsePostId.indexOf(postId)==-1){
                    responsePostId.push(postId);
                    var time = new Date(response[i].time).toISOString();
                    time = time.slice(0, 10);
                    
                    var score = 0;
                    for(var j=0; j<response[i].score.length; j++){
                        score += response[i].score.score;
                    }
                    content += '<div class="col-lg-4 col-xl-3 col-sm-12">';
                    content += '<a href="#" onclick="setLocalStorage(';
                    content += "'";
                    content += postId;
                    content += "')";
                    content += '">';
                    
                    content += '<div class="badge-box">';
                        content += '<div class="sub-title">';
                            content += '<span>貼文 #';
                            content += postId;
                            content += '</span>';
                            
                            content += '<span style="float:right;"><i class="fa fa-trophy" aria-hidden="true"></i>';
                            content += score;//score
                            content += '</span>';
                        content += '</div>';
                    
                        content += '<div>';
                            content += '<span>';
                            content += response[i].title;
                            content += '</span>';
                        content += '</div>';
                        
                        content += '<div style="margin-top: 20px;">';
                            for(var j=0; j<response[i].tag.length; j++){
                                content += '<label class="badge badge-default purpleLabel">';
                                content += response[i].tag[j].tag_name;
                                content += '</label>';
                            }
                            
                            content += '<div>';
                                content += '<label class="badge purpleLabel2">';
                                content += time;
                                content += '</label>';
                            content += '</div>';
                            
                        content += '</div>';
                    content += '</div>';
                    content += '</a>';
                    content += '</div>';
                }
                
            }
            
            document.getElementById("response").innerHTML = content;
        },
        error: function(){
            console.log("失敗: 拿回覆紀錄（query_user_response_list）");
        }
    });
    
    // 拿到使用者曾回覆的貼文 END
}

window.addEventListener("load", start, false);