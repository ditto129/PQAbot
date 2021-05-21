var head_url = "http://127.0.0.1:5000/";

//start
function start(){
    console.log("session_start");
    var myURL = head_url + "session_start";
    console.log("myURL: "+myURL);
    $.ajax({
        url: myURL,
        type: "GET",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log("response: "+response);
            console.log(response.message);
        },
        error: function(){
            console.log("error");
        }
    });
    
    console.log("start");
    var myURL = head_url + "welcome";
    console.log("myURL: "+myURL);
    $.ajax({
        url: myURL,
        type: "GET",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log("response: "+response);
            console.log(response.text);
            document.getElementById("content").innerHTML += '<font color="black">'+response.text+'</font><br>';
        },
        error: function(){
            console.log("error");
        }
    });
}

//send資料給rasa
function send_to_bot(){
    document.getElementById("content").innerHTML += '<font color="blue">'+$("#user_input").val()+'</font><br>';
    var myURL = head_url + "base_flow_rasa?message="+$("#user_input").val();

    console.log("myURL: "+myURL);
    $.ajax({
        url: myURL,
        type: "GET",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        success: function(response){
            console.log(response.text);
            document.getElementById("content").innerHTML += '<font color="black">'+response.text+'</font><br>';
            $("#user_input").val("");
        },
        error: function(){
            console.log("error");
        }
    });
}

window.addEventListener("load", start, false);