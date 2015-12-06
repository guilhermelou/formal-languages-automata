//var to indicate the state of mouse, 0 = mouse arrow, 1 = state
//2 = transition arrow, 3 = remove
_mouse_state = 0

$("#mouse_arrow").on('click', function () {
    _mouse_state = 0;
});
$( "#state" ).on('click', function () {
    _mouse_state = 1;
});
$( "#transition_arrow" ).on('click', function () {
    _mouse_state = 2;
});
$( "#remove" ).on('click', function () {
    _mouse_state = 3;
});

$("#drawCanvas").on('click', function (e) {
    var x = e.pageX - $(this).offset().left,
    y = e.pageY - $(this).offset().top;
    console.log(x+' '+y);
    
});

function findClickOnObject(x,y)
{
    //for (var i=0;)
};