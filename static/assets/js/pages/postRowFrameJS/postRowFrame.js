//function setPage(id, page){
//    console.log("id: "+id);
//    console.log("page: "+page);
//    localStorage.setItem("single_post_id", id);
//    localStorage.setItem("page", page);
//}
var pageNumber = 1;
function start(){
    
    var myURL = head_url + "query_inner_post_list";
    
    var data = {"page_size": 9, "page_number": pageNumber};
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
        },
        error: function(){
            console.log("失敗: 拿所有貼文（query_inner_post_list）");
        }
    });
    
//    <!--貼文1 start-->
//    <div class="col-lg-4 col-xl-3 col-sm-12">
//        <!-- 貼文連結start -->
//        <a href="#" onclick="setPage('444', 'mySinglePostFrame')">
//            <div class="badge-box">
//                <!-- 貼文編號與分數start -->
//                <div class="sub-title">
//                    <span>貼文 #00001</span>
//                    <span style="float:right;"><i class="fa fa-trophy" aria-hidden="true"></i>5</span>
//                </div>
//                <!-- 貼文編號與分數end -->
//                <!-- 貼文標題start -->
//                <div>
//                <span>連不上 server</span>
//                </div>
//                <!-- 貼文標題end -->
//                <div style="margin-top: 20px;">
//                    <!-- tag start-->
//                    <label class="badge badge-default purpleLabel">html</label>
//                    <label class="badge badge-default purpleLabel">javascript</label>
//                    <label class="badge badge-default purpleLabel">css</label>
//                    <!-- tag end-->
//                    <!-- 貼文日期start -->
//                    <div>
//                    <label class="badge purpleLabel2">2021 - 09 - 08</label>
//                    </div>
//                    <!-- 貼文日期end -->
//                </div>
//            </div>
//        </a>
//        <!-- 貼文連結end -->
//    </div>
}

window.addEventListener("load", start, false);