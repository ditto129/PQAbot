function start(){
    summaryContent();
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

function summaryContent(){
    var comment = document.getElementById("sclae-accordion");
    var content = "";
    for(var i=1; i<5; i++){
        content += '<div class="accordion-msg" style="">';
            content += ' <a class="ourHover" style="font-size: 20px; color: #505458;">最佳解答';
            content += i;
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
                content += '<button type="button" class="scoreBtn"><i class="fa fa-thumbs-up" aria-hidden="true"></i></button>';
                content += '<button type="button" class="scoreBtn" style="margin-right: 10px;"><i class="fa fa-thumbs-o-down" aria-hidden="true"></i></button>';
                    
                content += '<i class="fa fa-trophy" aria-hidden="true" style="color: #505458;"></i>';
                content += '<span style="margin-right: 5px; color: #505458;">30</span>';
            content += '</div>';

        content += '</div>';

        content += '<div class="accordion-desc">';
            content += '<p>';
                content += '<a href="https://www.youtube.com/watch?v=ewmMS-5TpTg&t=344s" target="_blank" class="">點我看原文</a><br><br>';
                content += '完整答案 或 答案摘要';
                content += i;
            content += '</p>';
        content += '</div>';
    }
    comment.innerHTML = content;
}

window.addEventListener("load", start, false);