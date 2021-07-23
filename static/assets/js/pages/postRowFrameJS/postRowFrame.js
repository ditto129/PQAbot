function setLocalStorage(id){
    localStorage.setItem("singlePostId", id);
    setPage('mySinglePostFrame');
}

var pageNumber = 1;
var pageNumberSearch = 1;
var pageNumberTag = 1;
var option = "score";
var postSum;

// 透過字搜尋
function search(which){
    localStorage.setItem("method", "text");
    if(which == "new"){
        pageNumberSearch = 1;
    }
    var text = $("#searchText").val();
    
    var data = {title: text, page_size: 5, page_number: pageNumberSearch, option: option};
    console.log(data);

    var myURL = head_url + "query_inner_post_list_by_title";
    console.log("搜尋: "+myURL);
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log("成功: 透過字搜尋貼文（query_inner_post_list_by_title）");
            console.log(response);
            postSum = response.post_count;
            showPost(response.post_list);
        },
        error: function(response){
            console.log("失敗: 透過字搜尋貼文（query_inner_post_list_by_title）");
            console.log(response);
        }
    });
}

// 透過tag搜尋
function searchByTags(which){
    localStorage.setItem("method", "tags");
    if(which == "new"){
        pageNumberTag = 1;
    }
    var sendTags=[];
    for(var i=0; i<chosenTags.length; i++){
        var temp = {tag_id: chosenTags[i], tag_name: allTags[chosenTags[i]]};
        sendTags.push(temp);
    }
    
    var data = {tag: sendTags, page_size: 5, page_number: pageNumberTag, option: option};
    console.log(data);
    
    var myURL = head_url + "query_inner_post_list_by_tag";
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log("成功: 透過tag搜尋貼文（query_inner_post_list_by_tag）");
            console.log(response);
            postSum = response.post_count;
            showPost(response.post_list);
        },
        error: function(response){
            console.log("失敗: 透過tag搜尋貼文（query_inner_post_list_by_tag）");
            console.log(response);
        }
    });
}

function editPageNum(sum){
    var method = localStorage.getItem("method");
    console.log("method: "+method);
    var temp;
    sum = parseInt(sum);
    console.log("總共幾頁: "+Math.ceil((postSum/5)));
    
    if(method == "all"){
        temp = pageNumber;
    }
    else if(method == "text"){
        temp = pageNumberSearch;
    }
    else if(method == "tags"){
        temp = pageNumberTag;
    }
    console.log("temp: "+temp)
    if(sum == 1 && temp<Math.ceil((postSum/5))){ // 下一頁
        console.log("下一頁");
        if(method == "all"){
            pageNumber += sum;
            start("old");
        }
        else if(method == "text"){
            pageNumberSearch += sum;
            search("old");
        }
        else if(method == "tags"){
            pageNumberTag += sum;
            searchByTags("old");
        }
        
    }
    else if(sum == -1 && temp>1){
        console.log("上一頁");
        if(method == "all"){
            pageNumber += sum;
            start("old");
        }
        else if(method == "text"){
            pageNumberSearch += sum;
            search("old");
        }
        else if(method == "tags"){
            pageNumberTag += sum;
            searchByTags("old");
        }
    }
}

function showPost(response){
    var content = "";
    for(var i=0; i<response.length; i++){
        var id = response[i]._id;
        var title = response[i].title;
        console.log("title: "+title);
        var tag = response[i].tag;
        var time = new Date(response[i].time);
        time = time.toISOString();
        time = time.slice(0, 10);
        var score = response[i].score;

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
    document.getElementById("post").innerHTML = content;
}

function start(which){
    localStorage.setItem("method", "all");
    if(which == "new"){
        pageNumber = 1;
    }
    getLanguageTag();
    var myURL = head_url + "query_inner_post_list";
    
    var data = {page_size: 5, page_number: pageNumber, option: option};
    console.log(data);
    var content = "";
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log("成功: 拿所有貼文（query_inner_post_list）");
            console.log(response);
            postSum = response.post_count;
            showPost(response.post_list);
        },
        error: function(){
            console.log("失敗: 拿所有貼文（query_inner_post_list）");
        }
    });
}

///////////////// 透過標籤篩選 START /////////////////
// 用來記使用者選擇的所有標籤
var language = [];
var children = [];
var chosenTags = [];
// 以上3個都是放id
var allTags = {};

//根據chosenTags的內容 顯示已選擇的tags
function showChosenTags(page){
    console.log("showChosenTags");
    var chosen_tag_content = "<hr>";
    var outer_content = "<br>";
    
    for(var i=0; i<chosenTags.length; i++){
        chosen_tag_content += '<label class="badge purpleLabel" style="margin-right: 5px;">';
            chosen_tag_content += allTags[chosenTags[i]];
        chosen_tag_content += '<button type="button" class="labelXBtn" onclick="cancle(';
        chosen_tag_content += "'";
        chosen_tag_content += chosenTags[i];
        chosen_tag_content += "','";
        chosen_tag_content += page;
        chosen_tag_content += "'";
        chosen_tag_content += ')">x</button></label>';
        
        outer_content += '<label class="badge purpleLabel" style="margin-right: 5px;">';
            outer_content += allTags[chosenTags[i]];
        outer_content += '</label>';
    }

    document.getElementById("chosen_tag_in_modal").innerHTML = chosen_tag_content;
    
    // 外面的最下面 也要顯示已選擇的tags
    document.getElementById("chosen_tag").innerHTML = outer_content;
}

// 顯示可選擇的語言「子」標籤
function click_tag(id, page){
    // tag -> 是選擇了哪個tag
    // page -> 是選語言(0) 還是選孩子(1)
    var tag = allTags[id];
    
    
    // 已選擇的tag START
    
    // card的最下面顯示已選擇的tags
    if(!chosenTags.includes(id)){ //如果還沒選過
        console.log("顯示起來～");
        chosenTags.push(id);
        document.getElementById(id).setAttribute("style", "margin-right: 5px; background-color: #E6E6FA;");
        if(language.indexOf(id)==-1){
            showChosenTags(1);
            console.log("page1");
        }
        else{
            showChosenTags(0);
            console.log("page0");
        }
    }
    // 已選擇的tag END
    
    
    // 可以選擇的標籤 START
    if(page==0){
        
        var myURL = head_url+"query_all_offspring_tag?tag_id="+id;
        children = [];
            $.ajax({
                url: myURL,
                type: "GET",
                async: false, 
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                success: function(response){
                    console.log("success");
                    //先記下allTags 包含名字&ID
                    for(var i=0; i<response.tags.length; i++){
                        console.log("i: "+i);
                        
                        var temp = response.tags[i].tag_name;
                        temp = temp.replace("'", "&apos;");
                        
                        allTags[response.tags[i].tag_id] = temp;
                        children.push(response.tags[i].tag_id);
                    }
                },
                error: function(){
                    console.log("error");
                }
            });
        showChildrenAndSetColor();
    }
    // 可以選擇的標籤 END
}

function showChildrenAndSetColor(){
    localStorage.setItem("chooseTags", 1);
    // 標題 START
    // 需加上上一頁的按鈕
    var titleContent = "";
    titleContent += '<i class="fa fa-angle-left scoreBtn" aria-hidden="true" onclick="showLanguageTag()" style="color: gray; margin-right: 5px;"></i>';
    titleContent += "選擇相關標籤";
    
    document.getElementById("exampleModalLabel").innerHTML = titleContent;
    // 標題 END
    
    var content = "";
    for(var i=0; i<children.length; i++){
        content += '<label id="';
        content += children[i]; //這裡要放id
        content += '" class="badge purpleLabel2" style="margin-right: 5px;';
        if(chosenTags.indexOf(children[i])!=-1){
            content += 'background-color: #E6E6FA;';
        }
        content += '" onclick="click_tag(';
        content += "'";
        content += children[i];
        content += "', '1'";
        content += ')">';
            content += allTags[children[i]];
        content += "</label>";
    }
    
//    console.log("innerHTML: "+content);
    document.getElementById("chose_tag").innerHTML = content;
}

// 顯示可選擇的語言標籤
function getLanguageTag(){
    
    // 中間內容 START
    // 先去跟後端拿 只有顯示語言的標籤有哪些
    var myURL = head_url+"query_all_languages";
    $.ajax({
        url: myURL,
        type: "GET",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log("success");
            //先記下allTags 包含名字&ID
            for(var i=0; i<response.tags.length; i++){
                language.push(response.tags[0]._id);
                allTags[response.tags[0]._id] = response.tags[0].tag;
                showLanguageTag();
            }
        },
        error: function(){
            console.log("error");
        }
    });
    // 中間內容 END
}

// 顯示「語言」tag的content
function showLanguageTag(){
    localStorage.setItem("chooseTags", 0);
    // 標題 START
    var titleContent = "";
    titleContent += "選擇相關標籤";
    
    document.getElementById("exampleModalLabel").innerHTML = titleContent;
    // 標題 END
    
    var content = "";
    for(var i=0; i<language.length; i++){
//        console.log("language.length: "+language.length);
//        console.log("language[i]: "+language[i]);
        content += '<label id="';
        content += language[i];
        content += '" class="badge purpleLabel2" style="margin-right: 5px;';
        //如果選過要變色
        if(chosenTags.indexOf(language[i])!=-1){
            content += 'background-color: #E6E6FA;';
        }
        content += '" onclick="click_tag(';
        content += "'";
        content += language[i];
        content += "', '0'"
        content += ')">';
            content += allTags[language[i]];
        content += '</label>';
    }

    document.getElementById("chose_tag").innerHTML = content;
}

// 取消選擇tag後的處理
function cancle(id, page){
    
    var index = chosenTags.indexOf(id);
    if(index != -1){
        chosenTags.splice(index,1);
        showChosenTags(page);
    }
    
    var temp = parseInt(localStorage.getItem("chooseTags"));
    console.log("page為: "+temp);
    if(temp==0 && language.indexOf(id)==-1){
        showChildrenAndSetColor();
        showLanguageTag();
        localStorage.setItem("chooseTags", 0);
    }
    else if(temp==0 && language.indexOf(id)!=-1){
        showLanguageTag();
    }
    else if(temp==1 && language.indexOf(id)==-1){
        showChildrenAndSetColor();
    }
    else{
        showLanguageTag();
        showChildrenAndSetColor();
        localStorage.setItem("chooseTags", 1);
    }
}
///////////////// 透過標籤篩選 END /////////////////

var optionVal = ["score", "view_count", "time"];
var optionText = ["貼文排序 | 依分數高低", "貼文排序 | 依觀看次數", "貼文排序 | 依日期"];
function changeSort(){
    var radio=document.getElementsByName("postSort");
    for(var i=0;i<radio.length;i++){
        if(radio[i].checked==true) {
            option = optionVal[i];
            document.getElementById("optionText").innerHTML = optionText[i];
            break;
        }
    }
    
    var method = localStorage.getItem("method");
    if(method == "all"){
        start("new");
    }
    else if(method == "text"){
        search("new");
    }
    else{
        searchByTags("new");
    }
}

function set(){
    localStorage.setItem("postAPI", "query_inner_post_list");
    var searchButton = document.getElementById("searchText");
    searchButton.addEventListener('keydown', function(e){
      // enter 的 keyCode 是 13
      if( e.keyCode === 13 ){
          search("new");
      }
    }, false);
}

window.addEventListener("load", function(){
    set();
    start("new");
}, false);