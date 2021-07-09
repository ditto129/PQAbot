function setPage(id, page){
    console.log("id: "+id);
    console.log("page: "+page);
    localStorage.setItem("single_post_id", id);
    localStorage.setItem("page", page);
}