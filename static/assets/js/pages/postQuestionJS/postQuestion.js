// 用來記使用者選擇的所有標籤
var language = [];
var chosenTags = [];
var allTags = {};

function start(){
    console.log("start");
    $("#tag_content").hide();
    
    //先去準備Tag的內容
    getLanguageTag();
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

//根據chosenTags的內容 顯示已選擇的tags
function showChosenTags(){
    var chosen_tag_content = "<hr>";
    
    for(var i=0; i<chosenTags.length; i++){
        chosen_tag_content += '<label class="badge purpleLabel" style="margin-right: 5px;">';
            chosen_tag_content += chosenTags[i];
        chosen_tag_content += '<button type="button" class="labelXBtn" onclick="cancle(';
        chosen_tag_content += "'";
        chosen_tag_content += chosenTags[i]
        chosen_tag_content += "', '";
        chosen_tag_content += allTags[chosenTags[i]];
        chosen_tag_content += "'";
        chosen_tag_content += ')">x</button></label>';
    }

    document.getElementById("chosen_tag_in_modal").innerHTML = chosen_tag_content;
    // 外面的最下面 也要顯示已選擇的tags
    document.getElementById("chosen_tag").innerHTML = chosen_tag_content;
}

// 顯示可選擇的語言「子」標籤
function click_tag(tag, id, page){
    // tag -> 是選擇了哪個tag
    // id -> 那個tag的id是什麼
    // page -> 是選語言(0) 還是選孩子(1)
    
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
    if(!chosenTags.includes(tag)){ //如果還沒選過
        
        chosenTags.push(tag);
        document.getElementById(id).setAttribute("style", "margin-right: 5px; background-color: #E6E6FA;");
        showChosenTags();
        
    }
    // 已選擇的tag END
    
    
    // 可以選擇的標籤 START
    if(page==0){
        var content = "";
        for(var i=0; i<10; i++){
            content += '<label id="';
            content += i; //這裡要放id
            content += '" class="badge purpleLabel2" style="margin-right: 5px;" onclick="click_tag(';
            content += "'";
            content += tag;
            content += i;
            content += "', '";
            content += "123";//這裡放ID
            content += "', '1'";
            content += ')">';
                content += tag;
                content += i;
            content += "</label>";
        }
        document.getElementById("chose_tag").innerHTML = content;
    }
    // 可以選擇的標籤 END
}

// 顯示可選擇的語言標籤
function getLanguageTag(){
    
    // 中間內容 START
    // 先去跟後端拿 只有顯示語言的標籤有哪些
//    var myURL = head_url+"query_all_languages";
//    $.ajax({
//        url: myURL,
//        type: "GET",
//        dataType: "json",
//        contentType: 'application/json; charset=utf-8',
//        success: function(response){
//            console.log("success");
//            //先記下allTags 包含名字&ID
//            language = ['python', 'Java', 'C'];
//            showLanguageTag();
//        },
//        error: function(){
//            console.log("error");
//        }
//    });
    // 中間內容 END
    
    language = ['python', 'Java', 'C'];
    showLanguageTag();
}

// 顯示「語言」tag的content
function showLanguageTag(){
    
    // 標題 START
    var titleContent = "";
    titleContent += "選擇相關標籤";
    
    document.getElementById("exampleModalLabel").innerHTML = titleContent;
    // 標題 END
    
    var content = "";
    for(var i=0; i<language.length; i++){
        console.log("language[i]: "+language[i]);
        content += '<label id="';
        content += allTags[language[i]];
        content += '" class="badge purpleLabel2" style="margin-right: 5px;';
        //如果選過要變色
        if(chosenTags.indexOf(language[i])!=-1){
            content += 'background-color: #E6E6FA;';
        }
        content += '" onclick="click_tag(';
        content += "'";
        content += language[i];
        content += "', '";
        content += "123"; //id
        content += "', '0'"
        content += ')">';
            content += language[i];
        content += '</label>';
    }

    document.getElementById("chose_tag").innerHTML = content;
}

// 取消選擇tag後的處理
function cancle(tag){
    console.log("要取消的tag: "+tag);
    var id = allTags[tag];
    document.getElementById(id).setAttribute("style", "margin-right: 5px; background-color: white;");
    
    var index = chosenTags.indexOf(tag);
    if(index != -1){
        chosenTags.splice(index,1);
        showChosenTags();
    }
}

window.addEventListener("load", start, false);