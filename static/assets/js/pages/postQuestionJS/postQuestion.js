function start(){
    console.log("start");
    localStorage.setItem("tag_level", 0);
    $("#tag_content").hide();
}

function show_choose_tag(){
    $("#tag_content").show();
    var content = "";
    content += '<i class="fa fa-angle-up" aria-hidden="true" style="float: right; color: gray;" onclick="hide_choose_tag()"></i>';
    document.getElementById("arrow").innerHTML = content;
}

function hide_choose_tag(){
    $("#tag_content").hide();
    console.log("toggle");
    var content = "";
    content += '<i class="fa fa-angle-down" aria-hidden="true" style="float: right; color: gray;" onclick="show_choose_tag()"></i>';
    document.getElementById("arrow").innerHTML = content;
}

function click_tag(language){
    var level = parseInt(localStorage.getItem("tag_level"));
    level += 1;
    localStorage.setItem("tag_level", level);
    console.log("language: "+language);
    
    var titleContent = "";
    titleContent += '<i class="fa fa-angle-left scoreBtn" aria-hidden="true" onclick="before_page()" style="color: gray; margin-right: 5px;"></i>';
    titleContent += "選擇相關標籤";
    
    document.getElementById("exampleModalLabel").innerHTML = titleContent;
    
    var content = "";
//    content += '<div onclick="before_page()">';
//        content += '<i class="fa fa-angle-left" aria-hidden="true"></i>';
//        content += '<span>上一頁</span>';
//    content += '</div>';
    
    for(var i=0; i<10; i++){
        content += '<label class="badge purpleLabel2" onclick="click_tag("';
        content += "'";
        content += language;
        content += i;
        content += "'";
        content += ")>";
            content += language;
            content += i;
        content += "</label>";
    }
    document.getElementById("chose_tag").innerHTML = content;
    
    
    var chosen_tag_content = document.getElementById("chosen_tag_in_modal").innerHTML;
    chosen_tag_content += '<label class="badge purpleLabel">';
    chosen_tag_content += language;
    chosen_tag_content += '<button type="button" class="labelXBtn">x</button></label>';
        
    document.getElementById("chosen_tag_in_modal").innerHTML = chosen_tag_content;
    document.getElementById("chosen_tag").innerHTML = chosen_tag_content;
}

function before_page(){
    console.log("上一頁");
    var level = parseInt(localStorage.getItem("tag_level"));
    level -= 1;
    localStorage.setItem("tag_level", level);
}

window.addEventListener("load", start, false);