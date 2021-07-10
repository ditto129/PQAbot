function title(name, color) {
  this.name = name;
  this.color = color;
}

// An array containing all the projects with their information
var titles = [
    new title('top 1 的標題', '#FFD700'),
    new title('top 2 的標題', '#CDC9C9'),
    new title('top 3 的標題', '#CD950C')
];

// Cacheing HTML elements
var trophy = document.querySelector('#trophy');
var questionName   = document.querySelector('#questionName');
var titleDiv = document.querySelector('#titleDiv');


function start(){
    var index = 0;
    setInterval(function(){
        // Fade out
        titleDiv.style.opacity = 0;
        index += 1;
        // Fade in 
        setTimeout(function(){ 
            questionName.innerHTML = titles[(index%3)].name;
            trophy.style.color = titles[(index%3)].color;
            trophy.class = "fa fa-trophy animate__swing";
            titleDiv.style.opacity = 1;
        },500);
    }, 3000);
}

window.addEventListener("load", start, false);

