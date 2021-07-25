function start(){
    
}

function save(){
    var num = $("#dataNum").val();
    var cycle = $("#dataCycle").val();
    var data = {num: num, cycle: cycle};
    console.log("data: ");
    console.log(data);
    
    // 結果是否成功
    $('#manageDataResult').modal('show');
}

window.addEventListener("load", start, false);