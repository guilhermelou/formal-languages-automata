//var to indicate the state of mouse, 0 = mouse arrow, 1 = state
//2 = transition arrow, 3 = remove
var MouseState = {
    ARROW: 0,
    STATE: 1,
    TRANS: 2,
    REMOVE: 3
};
_mouse_state = MouseState.ARROW;

//var to identify the element selected
_selected_element = null;

//Changing the state of mouse
$("#mouse_arrow").on('click', function () {
    _mouse_state = MouseState.ARROW;
});
$( "#state" ).on('click', function () {
    _mouse_state = MouseState.STATE;
});
$( "#transition_arrow" ).on('click', function () {
    _mouse_state = MouseState.TRANS;
});
$( "#remove" ).on('click', function () {
    _mouse_state = MouseState.REMOVE;
});

// $("#drawCanvas").on('click', function (e) {
//     var x = e.pageX - $(this).offset().left,
//     y = e.pageY - $(this).offset().top;
    
//     element = _automaton.getElementOn(x,y);
//     if (State.prototype.isPrototypeOf(element))
//     {
//         console.log('state');
//     }
//     else if (Transition.prototype.isPrototypeOf(element))
//     {
//         console.log('transition');
//     }
//     else
//     {
//         console.log('none');
//     }
// });
$("#drawCanvas").on('mousedown', function (e) {
    var x = e.pageX - $(this).offset().left,
    y = e.pageY - $(this).offset().top;
    
    var element = _automaton.getElementOn(x,y);
    if (State.prototype.isPrototypeOf(element))
    {   
    }
    else if (Transition.prototype.isPrototypeOf(element))
    {
    }
    else
    {
        console.log('none');
    }
});
$("#drawCanvas").on('mouseup', function (e) {
    var x = e.pageX - $(this).offset().left,
    y = e.pageY - $(this).offset().top;
    
    switch (_mouse_state) {
        case MouseState.ARROW:
            //changing the element selected
            _selected_element = _automaton.getElementOn(x,y);
            break;
        case MouseState.STATE:
            _selected_element = _automaton.createState('');
            break;
        case MouseState.TRANS:
            var state = _automaton.getStateOn(x,y);
            if (state != null)
            {
                _selected_element = _automaton.createTransition(_selected_element, state, '');
            }
            break;
        case MouseState.REMOVE:
            _selected_element = _automaton.getElementOn(x,y);
            var element = _automaton.getElementOn(x,y);
            if (State.prototype.isPrototypeOf(element))
            {
                console.log('state');
            }
            else if (Transition.prototype.isPrototypeOf(element))
            {
                console.log('transition');
            }
            else
            {
                console.log('none');
            }
            break;
        default:
            _mouse_state = MouseState.ARROW;
    }

    element = _automaton.getElementOn(x,y);
    if (State.prototype.isPrototypeOf(element))
    {
        console.log('state');
    }
    else if (Transition.prototype.isPrototypeOf(element))
    {
        console.log('transition');
    }
    else
    {
        console.log('none');
    }
});
$("#drawCanvas").on('mousemove', function (e) {
    var x = e.pageX - $(this).offset().left,
    y = e.pageY - $(this).offset().top;
    
    element = _automaton.getElementOn(x,y);
    if (State.prototype.isPrototypeOf(element))
    {
        console.log('state');
    }
    else if (Transition.prototype.isPrototypeOf(element))
    {
        console.log('transition');
    }
    else
    {
        console.log('none');
    }
});

function findClickOnObject(x,y)
{
    return 
};