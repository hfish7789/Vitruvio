$(document).ready(function(){
    $('[name="amount"], [name="type"], [name="cars"]').change(function(){
        amount = $('[name="amount"]').val()
        type = $('[name="type"]:checked').val()
        cars = $('[name="cars"]').val()
        if(amount && type && cars)
        {
            $('#expenses_details_container table tbody tr').remove();
            if(type == 'divide')
                amount = dues_round(amount / cars.length, 2)
            cars.forEach(function(car) {
                expense_row = `
                        <tr>
                            <td><input type="hidden" name="car_ids[]" value="`+car+`">`+$('[name="cars"] option[value="'+car+'"]').text()+`</td>
                            <td><input type="hidden" name="car_amounts[]" value="`+amount+`">`+amount+`</td>
                        </tr>`;
                $('#expenses_details_container table tbody').append(expense_row);
            });
            $('#expense_save_container').css('display','block');
        }
    })

    $("#select_all_cars").click(function(){
        if($("#select_all_cars").is(':checked') ){
            $('[name="cars"] > option').prop("selected","selected");// Select All Options
        }
        else{
            $('[name="cars"] > option').removeAttr("selected");            
        }
        $('[name="cars"]').trigger("change");// Trigger change to select 2
    });
})
    