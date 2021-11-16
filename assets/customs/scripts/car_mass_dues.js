function car_contract_dues_count_update()
{
	dues_amount = $('#dues_form [name="dues_amount"]').val()
    first_payment_amount = $('#dues_form [name="first_payment_amount"]').val()
	total_amount = $('#dues_form [name="total_amount"]').val()
	if(total_amount && dues_amount)
	{
        if(first_payment_amount > dues_amount)
        {
            $('#dues_form [name="first_payment_amount"]').val(dues_amount);
            first_payment_amount = dues_amount;
        }
		dues_count = calculate_dues_count(total_amount - first_payment_amount, dues_amount);
		$('#dues_form [name="dues_count"]').val(dues_count + 1);            		
	}	
}
function car_contract_dues_amount_update()
{
	dues_count = $('#dues_form [name="dues_count"]').val()
	total_amount = $('#dues_form [name="total_amount"]').val()
	if(total_amount && dues_count)
	{
		dues_amount = calculate_dues_amount(total_amount, dues_count);
		$('#dues_form [name="dues_amount"]').val(dues_amount);
		$('#dues_form [name="first_payment_amount"]').val(dues_amount);		
	}	
}


$(document).ready(function() {
    $('#dues_form [name="dues_count"]').change(function(){
    	car_contract_dues_amount_update()
    })
    $('#dues_form [name="dues_amount"]').change(function(){
    	car_contract_dues_count_update()
    })
    $('#dues_form [name="car_contract_type"]').change(function(){
        if($(this).val() == 'insurance')
            $('#dues_form #policy_container').css('display','block');
        else
            $('#dues_form #policy_container').css('display','none');
    })
    $('#create_dues').click(function(){
    	total_amount = $('#dues_form [name="total_amount"]').val()
    	dues_amount = $('#dues_form [name="dues_amount"]').val()
    	first_payment_amount = $('#dues_form [name="first_payment_amount"]').val()
    	first_payment_date = $('#dues_form [name="first_payment_date"]').val()
    	weeks_frequency = $('#dues_form [name="weeks_frequency"]').val()

        if(!total_amount)
            alert_error('Monto Total Obligatorio','El Monto a Total es Obligatorio para Generar las Cuotas')
        if(!dues_amount)
            alert_error('Monto Cuotas Obligatorio','El Monto de las Cuotas es Obligatorio para Generar las Cuotas')
        if(!first_payment_amount)
            alert_error('Monto Primer Pago Obligatorio','El Monto del Primer Pago es Obligatorio para Generar las Cuotas')
        if(!first_payment_date)
            alert_error('Fecha Primer Pago Obligatoria','La Fecha del Primer Pago es Obligatoria para Generar las Cuotas')
        if(!weeks_frequency)
            alert_error('Frecuencia de Pagos Obligatoria','La Frecuencia de Pagos es Obligatoria para Generar las Cuotas')
        
        frequency_value = $('#dues_form [name="weeks_frequency"] option:selected').data('frequency-value');
        frequency_unit = $('#dues_form [name="weeks_frequency"] option:selected').data('frequency-unit');
        
        if(total_amount && dues_amount && first_payment_amount && first_payment_date && weeks_frequency)
    	{
    		dues = calculate_dues(parseFloat(total_amount), parseFloat(dues_amount), parseFloat(first_payment_amount), first_payment_date, frequency_value, frequency_unit, []);
    		$('#dues_details_container table tbody tr').remove();
    		dues.forEach(function(due, due_index) {
    			date = format_date(due.date);
    			amount = due.amount;		
    			due_row = `
    					<tr>
    						<td>`+(due_index+1)+`</td>
    						<td><input type="hidden" name="due_dates[]" value="`+date+`">`+date+`</td>
    						<td><input type="hidden" name="due_amounts[]" value="`+amount+`">`+amount+`</td>
						</tr>`;
			    $('#dues_details_container table tbody').append(due_row);
			});
			$('#contract_save_container').css('display','block');
    	}
    })
    $(document).on('click', '.add_selected_car', function() {        
        car_data = $(this).data('car-data');
        $('#cars_selected_list tbody').append(`
        <tr>
            <td class="all">
                <input type="hidden" name="cars[]" value="${car_data.car_id}">
                ${car_data.identifier}
            </td>
            <td class="all">${car_data.year}</td>
            <td class="all">${car_data.car_status_label}</td>
            <td class="all">
                <button data-car-data='${JSON.stringify(car_data)}' type="button" class="btn btn-outline btn-circle btn-sm red remove_selected_car"><i class="fa fa-times"></i> Eliminar </button>
            </td>
        </tr>
        `)
        $(this).parent().parent().remove()
    })

    $(document).on('click', '.remove_selected_car', function() {        
        car_data = $(this).data('car-data');
        $('#cars_list tbody').append(`
        <tr>
            <td class="all">${car_data.identifier}</td>
            <td class="all">${car_data.year}</td>
            <td class="all">${car_data.car_status_label}</td>
            <td class="all">
                <button data-car-data='${JSON.stringify(car_data)}' type="button" class="btn btn-outline btn-circle btn-sm green add_selected_car"><i class="fa fa-times"></i> Eliminar </button>
            </td>
        </tr>
        `)
        var index = selected_cars.indexOf(car_data.car_id);
        if (index > -1) {
            selected_cars.splice(index, 1);
        }
        $(this).parent().parent().remove()
    })
    $('#add_status_car').click(function() {
        selected_status = $('#filter_cars_list [name="status"]').val();
        if(selected_status) {
            cars.forEach(function(car_data) {
                if(car_data.car_status == selected_status && !selected_cars.includes(car_data.car_id)) {
                    selected_cars.push(car_data.car_id)
                    $('#cars_selected_list tbody').append(`
                    <tr>
                        <td class="all">
                            <input type="hidden" name="cars[]" value="${car_data.car_id}">
                            ${car_data.identifier}
                        </td>
                        <td class="all">${car_data.year}</td>
                        <td class="all">${car_data.car_status_label}</td>
                        <td class="all">
                            <button data-car-data='${JSON.stringify(car_data)}' type="button" class="btn btn-outline btn-circle btn-sm red remove_selected_car"><i class="fa fa-times"></i> Eliminar </button>
                        </td>
                    </tr>
                    `)
                }
            })
        }
    })
    $('#add_filter_car').click(function() {
        var filtered_cars = $('#filtered_cars').val()
        if(filtered_cars) {
            filtered_cars.forEach(function(filtered_car_id){
                cars.forEach(function(car_data) {
                    if(car_data.car_id == filtered_car_id && !selected_cars.includes(car_data.car_id)) {
                        selected_cars.push(car_data.car_id)
                        $('#cars_selected_list tbody').append(`
                        <tr>
                            <td class="all">
                                <input type="hidden" name="cars[]" value="${car_data.car_id}">
                                ${car_data.identifier}
                            </td>
                            <td class="all">${car_data.year}</td>
                            <td class="all">${car_data.car_status_label}</td>
                            <td class="all">
                                <button data-car-data='${JSON.stringify(car_data)}' type="button" class="btn btn-outline btn-circle btn-sm red remove_selected_car"><i class="fa fa-times"></i> Eliminar </button>
                            </td>
                        </tr>
                        `)
                    }
                })
            })
        }
    })

    if(cars_error)
        alert_error('Carros Seleccionados', cars_error)
});
