function start(){
//    query_cache_by_id
    
//    var myURL = head_url+"query_cache_by_id";
//    console.log("myURL: "+myURL);
//    var data = {idx: id};
    var address = 'summaryResponse.json';
    $.ajax({
        url: address,
//        data: JSON.stringify(data),
        type: "GET",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log(response);
            summaryContent(response);
        },
        error: function(response){
        }
    });
}

function like(id){
    console.log("按了喜歡");
    var likeNum = document.getElementById(id);
    var number = parseInt(likeNum.innerHTML);
    number += 1;
    likeNum.innerHTML = number;
    console.log("id: "+id);
}

function dislike(id){
    console.log("按了不喜歡");
    var dislikeNum = document.getElementById(id);
    var number = parseInt(dislikeNum.innerHTML);
    number += 1;
    dislikeNum.innerHTML = number;
    console.log("id: "+id);
}

function summaryContent(response){
    // 問題
    var question = document.getElementById("stackoverflowQuestion");
    var questionScore = 0;
    for(var i=0; i<response.question.score.length; i++){
        questionScore += response.question.score[i].user_vote;
    }
    
    var content = "";
    content += '<span style="font-size: 25px; font-weight: bold; width: auto; color: #505458;">';
        content += response.question.title;//標題
        content += '<span style="float: right;">';
            content += '<i class="fa fa-trophy" aria-hidden="true" style="font-size: 10px; color: #505458;"></i>';
            content += '<span style="font-size: 10px; color: #505458;">';
                content += questionScore;
            content += '</span>';
        content += '</span>';
    content += '</span>';
    
    content += '<br>';
    
    content += '<a href="';
    content += response.link;
    content += '" target="_blank">點我看原文</a>';
    
    content += '<br><br>';
    
    content += '<div style="font-size: 16px; font-weight: bold; width: auto; color: #505458;">摘要: </div>';
    content += '<div style="margin-top: 10px; font-size: 12px;">';
        content += response.question.abstract;
    content += '</div>';

    
    content += '<br><br>';
    
    content += '<div style="font-size: 16px; font-weight: bold; width: auto; color: #505458;">原始內容: </div>';
    content += '<div style="margin-top: 10px; font-size: 12px;">';
        content += response.question.content;
    content += '</div>';

    
    content += '<button type="button" class="scoreBtn" style="float: right;"><i class="fa fa-thumbs-o-down" aria-hidden="true"></i>0</button>'; // 倒讚
    content += '<button type="button" class="scoreBtn" style="float: right;"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i>0</button>'; // 讚
    
    content += '<span class="badge badge-default purpleLabel2" style=" background-color: white;">';
        content += response.time.slice(0, 10);
    content += '</span>';
    question.innerHTML = content;
    hljs.highlightAll();
    
    // 回覆
    var comment = document.getElementById("sclae-accordion");
    content = "";
    for(var i=0; i<response.answers.length; i++){
        var like = 0, dislike = 0;
        for(var j=0; j<response.answers[i].score.length; j++){
            if(response.answers[i].user_vote==1){
                like += 1;
            }
            else if(response.answers[i].user_vote==-1){
                dislike += 1;    
            }
        }
        content += '<div class="accordion-msg" style="">';
            content += ' <a class="ourHover" style="font-size: 20px; color: #505458;">最佳解答';
            content += (i+1);
            content += '</a>';
        
            content += '<div style="float: right; font-size: 15px;">';

        
            // like & dislike
//                content += '<i class="fa fa-thumbs-o-up" aria-hidden="true" onclick="like(';
//                var temp = "like"+i;
//                content += "'";
//                content += temp;
//                content += "'";
//                content += ')"></i>';
//                content += '<span id="like';
//                content += i;
//                content += '" style="margin-right: 5px; color: gray;">0</span>';
//
//                content += '<i class="fa fa-thumbs-o-down" aria-hidden="true" onclick="dislike(';
//                var temp = "dislike"+i;
//                content += "'";
//                content += temp;
//                content += "'";
//                content += ')"></i>';
//                content += '<span id="dislike';
//                content += i;
//                content += '" style="margin-right: 5px; color: gray;">0</span>';
                content += '<button type="button" class="scoreBtn"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i>';
                content += like;
                content += '</button>';
                content += '<button type="button" class="scoreBtn" style="margin-right: 10px;"><i class="fa fa-thumbs-o-down" aria-hidden="true"></i>';
                content += dislike;
                content += '</button>';
                    
                content += '<i class="fa fa-trophy" aria-hidden="true" style="color: #505458;"></i>';
                content += '<span style="margin-right: 5px; color: #505458;">';
                content += response.answers[i].vote;
                content += '</span>';
            content += '</div>';

        content += '</div>';

        content += '<div class="accordion-desc">';
            content += '<p>';
                content += '<a href="';
                content += response.link;
                content += '#';
                content += response.answers[i].id;
                content += '" target="_blank" class="">點我看原文</a><br><br>';
                // 摘要 START
                content += '<div style="font-size: 16px; font-weight: bold; width: auto; color: #505458;">摘要: </div>';
                content += '<div style="margin-top: 10px; font-size: 12px;">';
                    content += response.answers[i].abstract;
                content += '</div>';
                // 摘要END
                
                content += '<br><br>';
                
                // 摘要 START
                content += '<div style="font-size: 16px; font-weight: bold; width: auto; color: #505458;">原始內容: </div>';
                content += '<div style="margin-top: 10px; font-size: 12px;">';
                    content += response.answers[i].content;
                content += '</div>';
                // 摘要END
        
            content += '</p>';
        content += '</div>';
    }
    comment.innerHTML = content;
}

window.addEventListener("load", start, false);