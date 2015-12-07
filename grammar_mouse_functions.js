$("#add_rule").on('click', function (e) {
    $('#grammar_body').append('<tr> \
                    <td class="td_lhs"><input type="text" class="input_lhs"></td> \
                    <td class="trans">-></td> \
                    <td class="td_rhs"><input type="text" class="input_rhs"></td> \
                  </tr>');
});
$("#add_input").on('click', function (e) {
    $('#test_tbody').append('<tr> \
                    <td class="td_input"><input type="text" class="input_test"></td> \
                    <td class="td_result"></td> \
                  </tr>');
});

function updateTable(array_input, array_result)
{
    $('#test_tbody').empty();
    for (var i = 0; i < array_input.length; i++) {
        $('#test_tbody').append('<tr> \
                    <td class="td_input"><input type="text" class="input_test">'+array_input[i]+'</td> \
                    <td class="td_result">'+array_result[i]+'</td> \
                  </tr>');

    };
};

$("#btn_test").on('click', function (e) {
    var rules = [];
    var lhs_array = [];
    var rhs_array = [];
    console.log(rules);
    var input_array = []
    $('#test_tbody tr').each(function() {
        var input = $(this).find(".input_test").val(); 
        input_array.push(input);
    });
    $('#grammar_body tr').each(function() {
        var input_lhs = $(this).find(".input_lhs").val();
        var input_rhs = $(this).find(".input_rhs").val();
        lhs_array.push(input_lhs);
        rhs_array.push(input_rhs);
        rules.push({input_lhs:input_rhs});
    });
    console.log(lhs_array);
    console.log(rhs_array);
    //var array_result = _grammar.testArray(input_array);
    //updateTable(input_array,array_result)
});
