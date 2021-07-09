// 用來記使用者選擇的所有標籤
var chosen_tags = [];

function start(){
    console.log("start");
    //localStorage.setItem("tag_level", 0);
    $("#tag_content").hide();
    
    //先去準備Tag的內容
    showLanguageTag();
}

// 目前不需要
function show_choose_tag(){
    $("#tag_content").show();
    var content = "";
    content += '<i class="fa fa-angle-up" aria-hidden="true" style="float: right; color: gray;" onclick="hide_choose_tag()"></i>';
    document.getElementById("arrow").innerHTML = content;
}

// 目前不需要
function hide_choose_tag(){
    $("#tag_content").hide();
    console.log("toggle");
    var content = "";
    content += '<i class="fa fa-angle-down" aria-hidden="true" style="float: right; color: gray;" onclick="show_choose_tag()"></i>';
    document.getElementById("arrow").innerHTML = content;
}

// 顯示可選擇的語言「子」標籤
function click_tag(getRootTag){
//    var level = parseInt(localStorage.getItem("tag_level"));
//    level += 1;
//    localStorage.setItem("tag_level", level);
    
    console.log("tag: "+tag);
    
    // 標題 START
    // 需加上上一頁的按鈕
    var titleContent = "";
    titleContent += '<i class="fa fa-angle-left scoreBtn" aria-hidden="true" onclick="showLanguageTag()" style="color: gray; margin-right: 5px;"></i>';
    titleContent += "選擇相關標籤";
    
    document.getElementById("exampleModalLabel").innerHTML = titleContent;
    // 標題 END
    
    
    // 已選擇的tag START
    // card的最下面顯示已選擇的tags
    chosen_tag.push(tag);
    
    var chosen_tag_content = "";
    for(var i=0; i<chosen_tag.length; i++){
        chosen_tag_content += '<label class="badge purpleLabel">';
            chosen_tag_content += chosen_tag[i];
        chosen_tag_content += '<button type="button" class="labelXBtn">x</button></label>';
    }
    
    document.getElementById("chosen_tag_in_modal").innerHTML = chosen_tag_content;
    // 外面的最下面 也要顯示已選擇的tags
    document.getElementById("chosen_tag").innerHTML = chosen_tag_content;
    // 已選擇的tag END
    
    
    // 可以選擇的標籤 START
    var content = "";
    
    for(var i=0; i<10; i++){
        content += '<label class="badge purpleLabel2" onclick="click_tag("';
        content += "'";
        content += tag;
        content += i;
        content += "'";
        content += ")>";
            content += tag;
            content += i;
        content += "</label>";
    }
    document.getElementById("chose_tag").innerHTML = content;
}

// 顯示可選擇的語言標籤
function showLanguageTag(){
    console.log("顯示只有語言的標籤");
    
    // 標題 START
    var titleContent = "";
    titleContent += "選擇相關標籤";
    
    document.getElementById("exampleModalLabel").innerHTML = titleContent;
    // 標題 END
    
    
    // 中間內容 START
    // 先去跟後端拿 只有顯示語言的標籤有哪些
    language = ['python', 'Java', 'C'];
    
    var content = "";
    for(var i=0; i<language.length; i++){
        console.log("language[i]: "+language[i]);
        content += '<label class="badge purpleLabel2" onclick="click_tag(';
        content += "'";
        content += language[i];
        content += "'";
        content += ')">';
            content += language[i];
        content += '</label>';
    }
    
    document.getElementById("chose_tag").innerHTML = content;
    // 中間內容 END
    
}

window.addEventListener("load", start, false);