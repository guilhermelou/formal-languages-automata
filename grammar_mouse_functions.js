//Add Rule to table btn click
$("#grammar_add_rule").on('click', function (e) {
    $('#grammar_body').append('<tr> \
                    <td class="td_lhs"><input type="text" class="input_lhs"></td> \
                    <td class="trans">-></td> \
                    <td class="td_rhs"><input type="text" class="input_rhs"></td> \
                  </tr>');
});
//Add input to tests btn blick
$("#grammar_add_input").on('click', function (e) {
    $('#grammar_test_tbody').append('<tr> \
                    <td class="td_input"><input type="text" class="grammar_input_test"></td> \
                    <td class="td_result"></td> \
                  </tr>');
});
//update table with the results
function updateTable(array_input, array_result)
{
    $('#grammar_test_tbody').empty();
    for (var i = 0; i < array_input.length; i++) {
        $('#grammar_test_tbody').append('<tr> \
                    <td class="td_input"><input type="text" class="grammar_input_test" value="'+array_input[i]+'"></td> \
                    <td class="td_result">'+array_result[i]+'</td> \
                  </tr>');

    };
};
//run tests
$("#grammar_btn_test").on('click', function (e) {
    var rules = [];
    var lhs_array = [];
    var rhs_array = [];
    var input_array = []
    $('#grammar_test_tbody tr').each(function() {
        var input = $(this).find(".grammar_input_test").val(); 
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
