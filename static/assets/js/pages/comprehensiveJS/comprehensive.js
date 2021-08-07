function start(){
    var address = 'stackoverflowRank.json';
    $.ajax({
        url: address,
//        data: JSON.stringify(data),
        type: "GET",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log(response);
//            rankContent(response);
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

function rankContent(response){
//    console.log(response);
    var comment = document.getElementById("accordion");
    var content = "";
    for(var i=0; i<response.scores.length; i++){
//        console.log("i: "+i);
        content += '<div class="accordion-panel">';//第一個div
            //----- 標題 START -----//
            content += '<div class="accordion-heading" role="tab" id="heading';
            content += i;
            content += '">';
            
                content += '<h3 class="card-title accordion-title">';
                    content += '<a class="accordion-msg" data-toggle="collapse" data-parent="#accordion" href="#collapse';
                    content += i;
                    content += '" aria-expanded="true" aria-controls="collapse';
                    content += i;
                    content += '">';
                        content += '最佳解答'
                        content += (i+1);
                    
        
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
                        content += '<button type="button" class="scoreBtn"><i class="fa fa-thumbs-up" aria-hidden="true"></i></button>';
                        content += '<button type="button" class="scoreBtn" style="margin-right: 10px;"><i class="fa fa-thumbs-o-down" aria-hidden="true"></i></button>';

                        content += '<i class="fa fa-trophy" aria-hidden="true" style="color: #505458;"></i>';
                        content += '<span style="margin-right: 5px; color: #505458;">30</span>';
                    content += '</a>';
                content += '</h3>';
            content += '</div>';
            //----- 標題 END -----//
        
            //----- 解答 START -----//
            content += '<div id="collapse';
            content += i;
            content += '" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading';
            content += i;
            content += '">';

                content += '<div class="accordion-content accordion-desc">';
        
                    content += '<p>';
                        content += '<a href="https://www.youtube.com/watch?v=ewmMS-5TpTg&t=344s" target="_blank">點我看原文</a><br><br>';
                        content += response.scores[i].content;
                    content += '</p>';
                content += '</div>';
            content += '</div>';
        content += '</div>'
    }
    comment.innerHTML = content;
}

window.addEventListener("load", start, false);