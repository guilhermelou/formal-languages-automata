//var to indicate the state of mouse, 0 = mouse arrow, 1 = state
//2 = transition arrow, 3 = remove
var MouseState = {
    ARROW: 0,
    STATE: 1,
    TRANS: 2,
    REMOVE: 3
};
_mouse_state = MouseState.ARROW;



//Changing the state of mouse
$("#mouse_arrow").on('click', function () {
    _mouse_state = MouseState.ARROW;
    _selected_element = null;
    $('#drawCanvas').css( 'cursor', 'default' );
});
$( "#state" ).on('click', function () {
    _mouse_state = MouseState.STATE;
    _selected_element = null;
    $('#drawCanvas').css( 'cursor', 'default' );
});
$( "#transition_arrow" ).on('click', function () {
    _mouse_state = MouseState.TRANS;
    _selected_element = null;
    $('#drawCanvas').css( 'cursor', 'default' );
});
$( "#remove" ).on('click', function () {
    _mouse_state = MouseState.REMOVE;
    _selected_element = null;
    $('#drawCanvas').css( 'cursor', 'not-allowed' );
});

$("#drawCanvas").on('click', function (e) {
    var x = e.pageX - $(this).offset().left,
    y = e.pageY - $(this).offset().top;
    
    switch (_mouse_state) {
        case MouseState.ARROW:
            change_selected_for_input(_automaton.getElementOn(x,y));
            break;
        case MouseState.STATE:
            change_selected_for_input(_automaton.getElementOn(x,y));
            break;
        case MouseState.TRANS:
            break;
        case MouseState.REMOVE:
            break;
        default:
            _mouse_state = MouseState.ARROW;
    }
    updateCanvas();
});

//
$("#drawCanvas").on('mousedown', function (e) {
    var x = e.pageX - $(this).offset().left,
    y = e.pageY - $(this).offset().top;
    
    switch (_mouse_state) {
        case MouseState.ARROW:
            //changing the element selected
            _selected_element = _automaton.getElementOn(x,y);
            break;
        case MouseState.STATE:
            break;
        case MouseState.TRANS:
            _selected_element = _automaton.getStateOn(x,y);
            break;
        case MouseState.REMOVE:
            break;
        default:
            _mouse_state = MouseState.ARROW;
    }
    updateCanvas();
});
$("#drawCanvas").on('mouseup', function (e) {
    var x = e.pageX - $(this).offset().left,
    y = e.pageY - $(this).offset().top;
    
    switch (_mouse_state) {
        case MouseState.ARROW:
            //changing the element selected
            _selected_element = null;
            break;
        case MouseState.STATE:
            _selected_element = _automaton.createState(x,y,'');
            break;
        case MouseState.TRANS:
            if (State.prototype.isPrototypeOf(_selected_element))
            {
                var state = _automaton.getStateOn(x,y);
                if (state != null)
                {
                    _selected_element = _automaton.createTransition(_selected_element, state, '');
                    change_selected_for_input(_selected_element);
                }
            }
            break;
        case MouseState.REMOVE:
            _selected_element = _automaton.getElementOn(x,y);
            _automaton.removeElement(_selected_element);
            _selected_element = null;
            break;
        default:
            _mouse_state = MouseState.ARROW;
    }
    updateCanvas();
});
$("#drawCanvas").on('mousemove', function (e) {
    var x = e.pageX - $(this).offset().left,
    y = e.pageY - $(this).offset().top;
    switch (_mouse_state) {
        case MouseState.ARROW:
            if (State.prototype.isPrototypeOf(_selected_element))
            {
                _selected_element.setXY(x,y);
                updateCanvas();
            } 
            break;
        case MouseState.STATE:
            break;
        case MouseState.TRANS:
            if (State.prototype.isPrototypeOf(_selected_element))
            {
                clearCanvas();
                arrow = calculateArrow(_selected_element.x, _selected_element.y, x , y, 1);
                drawLine(_selected_element.x, _selected_element.y, x , y, 'gray');
                drawArrow(arrow);
                _automaton.drawAutomaton();
            }
            break;
        case MouseState.REMOVE:
            break;
        default:
            _mouse_state = MouseState.ARROW;
    }
    
});

function findClickOnObject(x,y)
{
    return 
};