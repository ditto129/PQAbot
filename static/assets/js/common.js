var head_url = "http://0.0.0.0:55001/";
//var head_url = "http://140.121.197.130:55001/";

localStorage.setItem("sessionID", 123);

function setPage(page){
    localStorage.setItem("page", page);
//    changePage();
}

//function changePage(){
//    var page = localStorage.getItem("page");
//    
//    var content = "";
//    content += '<iframe MARGINWIDTH=0 MARGINHEIGHT=0 HSPACE=0 VSPACE=0 frameborder=0 scrolling=auto src="';
//    content += page;
//    content += '.html" height="100%" width="100%"></iframe>';
//    document.getElementById("main_page").innerHTML = content;
//}