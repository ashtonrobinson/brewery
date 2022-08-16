document.addEventListener("DOMContentLoaded", function() { //sets cached scroll height on load
    var stages = document.getElementsByClassName("circlechartNodeWrapper");
    var maxWidth = 0;
    var maxHeight = 0;
    for (var i = 0; i < stages.length; i++) {
        stages[i].children[0].innerHTML = stages[i].children[0].innerHTML.replace(' ', '<br>')
        if (stages[i].clientWidth > maxWidth){
            maxWidth = stages[i].clientWidth;
        }
        if (stages[i].clientHeight > maxHeight){
            maxHeight = stages[i].clientHeight;
        }
    };
    for (var i = 0; i < stages.length; i++) {
        stages[i].style.width = maxWidth - 20 + 'px'; //remove padding
        stages[i].style.height = maxHeight - 20 + 'px';
        var toRotate = 360 / stages.length * i;
        var toOffsetWidth = stages[i].offsetWidth/2;
        var toOffsetHeight = stages[i].offsetHeight/2;
        stages[i].style.transform = "rotate(" + toRotate + "deg) translate(0, -235px) rotate(-" + toRotate + "deg) translate(-" + toOffsetWidth + "px, 0) translate(0, -" +toOffsetHeight + "px)";
    };
});