//function setPage(id, page){
//    console.log("id: "+id);
//    console.log("page: "+page);
//    localStorage.setItem("single_post_id", id);
//    localStorage.setItem("page", page);
//}

function setLocalStorage(id){
    localStorage.setItem("singlePostId", id);
    setPage('mySinglePostFrame');
}

var pageNumber = 1;
var pageNumberSearch = 1;
var pageNumberTag = 1;
var option = "score";

function search(){
    var text = $("#searchText").val();
    
    var data = {title: text, page_size: 5, page_number: pageNumberSearch, option: option};
    console.log(data);

    var myURL = head_url + "query_inner_post_list_by_title";
    $.ajax({
        url: myURL,
        type: "POST",
        data: JSON.stringify(data),
        async: false,
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log("成功: 搜尋貼文（query_inner_post_list_by_title）");
            showPost(response);
        },
        error: function(response){
            console.log("失敗: 搜尋貼文（query_inner_post_list_by_title）");
            console.log(response);
        }
    });
}

function editPageNum(sum){
    console.log("點擊");
    sum = parseInt(sum);
    if(sum == 1){ // 下一頁
        pageNumber += 1;
        start();
    }
    else if(sum == -1 && pageNumber>1){
        pageNumber -= 1;
        start();
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

function start(){
    
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
            
            showPost(response);
        },
        error: function(){
            console.log("失敗: 拿所有貼文（query_inner_post_list）");
        }
    });
}

window.addEventListener("load", start, false);