var answerNum = 0;

///////////////// 手動新增 START /////////////////

// 回覆 START
function addFAQsData(){
    // 初始化 START
    answerNum = 0;
    document.getElementById("addFAQAnswerContent").innerHTML = "";
    language = [];
    children = [];
    chosenTags = [];
    allTags = {};
    whoUseTags = "addFaq";
    getLanguageTag();
    // 初始化 END
    $('#newFAQsData').modal('show');
}

function addFAQAnswerNum(){
    var addFAQAnswerContent = document.getElementById("addFAQAnswerContent");
    
    var newAnswerDiv = document.createElement('div');
    newAnswerDiv.id = answerNum;
    
    var content = "";
    content += '<br>';
    content += '回覆的分數：<input id="FAQAnswerScore';
    content += answerNum;
    content += '" class="addFAQsInput"><br>';
    content += '回覆的內容：<br><textarea id="FAQAnswerContent';
    content += answerNum;
    content += '" class="addFAQsTextarea"></textarea><br>';
    content += '<button class="grayButton" onclick="deleteFAQsAnswerInAdd(\'';
    content += answerNum;
    content += '\')">刪除此則回覆</button>';
    content += '<br>';
    
    addFAQAnswerContent.appendChild(newAnswerDiv);
    document.getElementById(answerNum).innerHTML = content;
    answerNum += 1;
}

function deleteFAQsAnswerInAdd(answerId){
    var obj = document.getElementById(answerId);
    obj.innerHTML = "";
    var parentObj = obj.parentNode;//获取ul的父对象
    parentObj.removeChild(obj);//通过ul的父对象把它删除
}
// 回覆 END
//-----------------------
// 標籤 START

// 用來記使用者選擇的所有標籤
var language = [];
var children = [];
var chosenTags = [];
var allTags = {};
var whoUseTags;

//根據chosenTags的內容 顯示已選擇的tags
function showChosenTags(page){
//    console.log("showChosenTags");
    var chosen_tag_content = "<hr>";
    var showTagsButNotCancleContent = "";
    
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
        
        
            showTagsButNotCancleContent += '<label class="badge purpleLabel" style="margin-right: 5px;">';
            showTagsButNotCancleContent += allTags[chosenTags[i]];
            showTagsButNotCancleContent += '</label>';
        
    }

    if(whoUseTags=="addFaq"){
        document.getElementById("chosen_tag_in_modal").innerHTML = chosen_tag_content;
    }
    else if(whoUseTags=="searchFaq"){
        document.getElementById("chosenTagInModalForSearch").innerHTML = chosen_tag_content;
        
        document.getElementById("chosenTags").innerHTML = showTagsButNotCancleContent;
    }
}

// 顯示可選擇的語言「子」標籤
function click_tag(id, page){
    // tag -> 是選擇了哪個tag
    // page -> 是選語言(0) 還是選孩子(1)
    var tag = allTags[id];
    
    
    // 已選擇的tag START
    
    // card的最下面顯示已選擇的tags
    if(!chosenTags.includes(id)){ //如果還沒選過
//        console.log("顯示起來～");
        chosenTags.push(id);
        document.getElementById(id).setAttribute("style", "margin-right: 5px; background-color: #E6E6FA;");
        if(language.indexOf(id)==-1){
            showChosenTags(1);
//            console.log("page1");
        }
        else{
            showChosenTags(0);
//            console.log("page0");
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
    
    if(whoUseTags == "addFaq"){
        titleContent += "選擇相關標籤<br>";
        titleContent += '<i class="fa fa-angle-left scoreBtn" aria-hidden="true" onclick="showLanguageTag()" style="color: gray; margin-right: 5px; font-size: 15px;"></i><span style="color: gray; font-size: 13px; font-weight: lighter;">上一頁<span>';

        document.getElementById("addFAQTags").innerHTML = titleContent;
    }
    else if(whoUseTags == "searchFaq"){
        titleContent += '<i class="fa fa-angle-left scoreBtn" aria-hidden="true" onclick="showLanguageTag()" style="color: gray; margin-right: 5px; font-size: 15px;"></i><span style="color: gray; font-size: 13px; font-weight: lighter;">上一頁<span>';
        document.getElementById("forwardPageInModal").innerHTML = titleContent;
    }
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
    document.getElementById("chose_tag").innerHTML = content;
    document.getElementById("choseTagForSearch").innerHTML = content;
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
    
    var content = "";
    for(var i=0; i<language.length; i++){
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
    if(whoUseTags=="addFaq"){
        document.getElementById("chose_tag").innerHTML = content;
        document.getElementById("addFAQTags").innerHTML = "選擇相關標籤";
    }
    else if(whoUseTags=="searchFaq"){
        document.getElementById("choseTagForSearch").innerHTML = content;
        document.getElementById("forwardPageInModal").innerHTML = "";
    }
    
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

// 標籤 END
//-----------------------

function saveFAQByHand(){
    var dataURL = $("#dataURL").val();
    $("#dataURL").val("");
    var FAQScore = $("#FAQScore").val();
    $("#FAQScore").val("");
    var FAQTitle = $("#FAQTitle").val();
    $("#FAQTitle").val("");
    var FAQContent = $("#FAQContent").val();
    $("#FAQContent").val("");
    
    var FAQAnswers = [];
    var children = $("#addFAQAnswerContent").children();
    for(var i=0; i<children.length; i++){
//        console.log(children[i].id);
        var vote = $("#FAQAnswerScore"+children[i].id).val();
        var content = $("#FAQAnswerContent"+children[i].id).val();
        
        FAQAnswers.push({vote: vote, content: content});
    }
    
    var tag = [];
    for(var i=0; i<chosenTags.length; i++){
        var temp = {"tag_id": chosenTags[i], "tag_name": allTags[chosenTags[i]]};
        tag.push(temp);
    }
    
    var time = new Date().toJSON();
    time = time.slice(0, 23);
    
//    var data = {link: dataURL, question: {title: FAQTitle, content: FAQContent}, answers: FAQAnswers, time: time};
    var data = {link: dataURL, question: {title: FAQTitle, content: FAQContent, vote: FAQScore}, answers: FAQAnswers, tags: tag, time: time};
    console.log("傳出去的Data");
    console.log(data);

    var myURL = head_url + "insert_faq_post";
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log("成功: 新增貼文（insert_faq_post）");
            console.log(response);
            faqPageNumberAll = 1;
            faqOption = "time";
            searchFaqPost();
            searchAll("new");
        },
        error: function(response){
//            console.log("失敗: 編輯貼文（insert_faq_post）");
//            console.log(response);
        }
    });
    
}

///////////////// 手動新增 END /////////////////

///////////////// 匯入檔案 START /////////////////

// 匯入檔案（完整FAQ） START
function importFAQsData(){
    $('#importFAQsData').modal('show');
    $("#code").removeClass();
    $("#code").addClass("json");
}

function getFile(fileList){
    
}
// 匯入檔案（完整FAQ） END

///////////////// 匯入檔案 END /////////////////

///////////////// 搜尋的處理 START /////////////////
var faqPageNumberAll = 1;
var faqPageNumberString = 1;
var faqPageNumberTag = 1;
var faqOption = "score";
var faqSum;

function setLocalStorage(id){
    localStorage.setItem("singlePostId", id);
    setPage('mySinglePostFrame');
}

//---------- 頁數按鈕的處理 START ----------//
function disabledButton(id){
    document.getElementById(id).disabled = true;
    document.getElementById(id).classList.add("disabledButton");
}

function abledButton(id){
    document.getElementById(id).disabled = false;
    document.getElementById(id).classList.remove("disabledButton");
}

function editPageNum(sum){
    var begin = 1, end = Math.ceil((faqSum/5));
    
    var method = localStorage.getItem("method");
    var temp;
    sum = parseInt(sum);
    
    switch(method){
        case "all":
            temp = faqPageNumberAll+sum;
            faqPageNumberAll = temp;
            searchAll("old");
            break;
        case "text":
            temp = faqPageNumberString+sum;
            faqPageNumberString = temp;
            searchText("old");
            break;
        case "tags":
            temp = faqPageNumberTag+sum;
            faqPageNumberTag = temp;
            searchTag("old");
            break;
    }
    console.log("temp: "+temp);
    if(temp == begin){
        disabledButton("backwardPage");
    }
    else{
        abledButton("backwardPage");
    }
    
    console.log("temp: "+temp);
    console.log("end: "+end);
    if(temp == end){
        disabledButton("forwardPage");
    }
    else{
        abledButton("forwardPage");
    }
}
//---------- 頁數按鈕的處理 END ----------//

// 顯示貼文
function showFaq(faqList){
    // 處理上下頁Button START
    if(faqSum<=5){
        disabledButton("forwardPage");
    }
    else{
        abledButton("forwardPage");
    }
    // 處理上下頁Button END
    
    var role = localStorage.getItem("role");
    var content = "";
    if(faqList.length==0){
        content = '<div class="title">目前沒有符合的FAQ</div>';
    }
    for(var i=0; i<faqList.length; i++){
        var id = faqList[i]._id;
        var title = faqList[i].question.title;
        var tags = faqList[i].tags;
        var time = new Date(faqList[i].time);
        time = time.toISOString();
        time = time.slice(0, 10);
        var score = faqList[i].score;

        content += '<div class="col-lg-4 col-xl-3 col-sm-12">';
        content += '<a href="#" onclick="setLocalStorage(';
        content += "'";
        content += id;
        content += "')";
        content += '">';

            content += '<div class="badge-box">';
                content += '<div class="sub-title">';
                    content += '<span> FAQ的ID #';
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
                    for(var j=0; j<tags.length; j++){
                        content += '<label class="badge badge-default purpleLabel">';
                            content += tags[j].tag_name;
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
    document.getElementById("faq").innerHTML = content;
}

//---------- 篩選貼文方式 START -----------//
// 篩選時的一些處理
function filter(){
    language = [];
    children = [];
    chosenTags = [];
    allTags = {};
    whoUseTags = "searchFaq";
    getLanguageTag();
    $("#aboutSearch").modal("show");

    document.getElementById("searchAll").addEventListener("click", showSearchAll, false);
    document.getElementById("searchText").addEventListener("click", showSearchTextInput, false);
    document.getElementById("searchTag").addEventListener("click", showSearchTagInput, false);
    
    document.getElementById("chose_tag").innerHTML = "";
    document.getElementById("chosen_tag_in_modal").innerHTML = "";
}

// 隱藏打字＆選標籤的地方
function showSearchAll(){
    if($('input:radio[name="searchType"]:checked').val()=="searchAll"){
        $("#searchTextContent").hide(); // 隱藏別人的
        $("#searchTagContent").hide(); // 隱藏別人的
    }
}

// 顯示打字的地方
function showSearchTextInput(){
//    console.log("值: "+$('input:radio[name="searchType"]:checked').val());
    if($('input:radio[name="searchType"]:checked').val()=="searchText"){
        $("#searchTextContent").show(); // 顯示自己的
        $("#searchTagContent").hide(); // 隱藏別人的
    }
}

// 顯示選擇tag的地方
function showSearchTagInput(){
    if($('input:radio[name="searchType"]:checked').val()=="searchTag"){
        $("#searchTagContent").show(); // 顯示自己的
        $("#searchTextContent").hide(); // 隱藏別人的
    }
}
//---------- 篩選貼文方式 END ----------//

//---------- 搜尋方法 START ----------//
// 顯示全部的FAQ
function searchAll(which){
    localStorage.setItem("method", "all");
    if(which == "new"){
        pageNumber = 1;
        disabledButton("backwardPage");
    }
    else{
        abledButton("backwardPage");
    }
    var myURL = head_url + "query_faq_list";
    
    var data = {page_size: 5, page_number: faqPageNumberAll, option: faqOption};
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
//            console.log("成功: 拿所有FAQs（query_faq_list）");
            console.log(response);
            faqSum = response.faq_count;
            showFaq(response.faq_list);
        },
        error: function(){
//            console.log("失敗: 拿所有FAQs（query_faq_list）");
        }
    });
}

// 透過字串搜尋
function searchText(which){
    localStorage.setItem("method", "text");
    if(which == "new"){
        faqPageNumberString = 1;
        disabledButton("backwardPage");
    }
    else{
        abledButton("backwardPage");
    }
    var text = $("#searchTextContent").val();
    
    var data = {search_string: text, page_size: 5, page_number: faqPageNumberString, option: faqOption};

    var myURL = head_url + "query_faq_list_by_string";
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
//            console.log("成功: 透過字搜尋faq（query_faq_list_by_string）");
//            console.log(response);
            faqSum = response.faq_count;
            showFaq(response.faq_list);
        },
        error: function(response){
//            console.log("失敗: 透過字搜尋faq（query_faq_list_by_string）");
//            console.log(response);
        }
    });
}

// 透過TAG搜尋FAQ
function searchTag(which){
    localStorage.setItem("method", "tags");
    if(which == "new"){
        faqPageNumberTag = 1;
        disabledButton("backwardPage");
    }
    else{
        abledButton("backwardPage");
    }
    var sendTags=[];
    for(var i=0; i<chosenTags.length; i++){
        var temp = {tag_id: chosenTags[i], tag_name: allTags[chosenTags[i]]};
        sendTags.push(temp);
    }
    
    var data = {tag: sendTags, page_size: 5, page_number: faqPageNumberTag, option: faqOption};
//    console.log(data);
    
    var myURL = head_url + "query_faq_list_by_tag";
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
//            console.log("成功: 透過tag搜尋FAQ（query_faq_list_by_tag）");
//            console.log(response);
            faqSum = response.faq_count;
            showFaq(response.faq_list);
        },
        error: function(response){
//            console.log("失敗: 透過tag搜尋FAQ（query_faq_list_by_tag）");
//            console.log(response);
        }
    });
}
//----------- 搜尋方法 START ----------//

// 開始搜尋 呼叫各自的API＆顯示的東西
function searchFaqPost(){
    var searchType = $('input:radio[name="searchType"]:checked').val();
    var sortType = $('input:radio[name="sortType"]:checked').val();
    var content = "篩選條件", contentSearch, contentSort;
    
    switch(sortType){
        case "sortScore":
            faqOption = "score";
            contentSort = " | 依分數排序";
            break;
        case "sortView":
            faqOption = "view_count";
            contentSort = " | 依觀看次數排序";
            break;
        case "sortDate":
            faqOption = "time";
            contentSort = " | 依日期排序";
            break;
    }
    
    switch(searchType){
        case "searchAll":
            searchAll("new");
            contentSearch = " | 顯示全部";
            break;
        case "searchText":
            searchText("new");
            contentSearch = " | 相關的字";
            break;
        case "searchTag":
            searchTag("new");
            contentSearch = " | 相關標籤";
            break;
    }
    
    document.getElementById("optionText").innerHTML = content+contentSearch+contentSort;
}
///////////////// 搜尋的處理 END /////////////////


function set(){
    getLanguageTag();
    localStorage.setItem("forwardPage", "FaqFrame");
    localStorage.setItem("postAPI", "query_faq_list");
    localStorage.setItem("postType", "faq");
    
    $("#searchTextContent").hide();
    $("#searchTagContent").hide();
    
    if(localStorage.getItem("role")=="manager"){
        document.getElementById("newFaqData").innerHTML = '<button class="themeButton" onclick="addFAQsData()">新增</button><button class="themeButton" onclick="importFAQsData()">匯入</button>';
    }
    

//    var searchButton = document.getElementById("searchText");
//    searchButton.addEventListener('keydown', function(e){
//      // enter 的 keyCode 是 13
//      if( e.keyCode === 13 ){
//          searchText("new");
//      }
//    }, false);
}

window.addEventListener("load", function(){
    set();
    searchAll("new");
}, false);