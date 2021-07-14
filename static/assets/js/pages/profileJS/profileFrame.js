function setLocalStorage(id){
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
            console.log(response);
            
            for(var i=0; i<response.length; i++){
                var id = response[i]._id;
                var title = response[i].title;
                var tag = response[i].tag;
                var time = response[i].time.slice(0, 10);
                var score = 0;
                
                for(var j=0; j<response[i].score.length; j++){
                    score += response[i].score.score;
                }
                
                content += '<div class="col-lg-4 col-xl-3 col-sm-12">';
                content += '<a href="#" onclick="setLocalStorage(';
                content += "'";
                content += id;
                content += "')";
                content += '">';
                
                    content += '<div class="badge-box">';
                        content += '<div class="sub-title">';
                            content += '<span>貼文 ';
                            content += id;
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
}

window.addEventListener("load", start, false);