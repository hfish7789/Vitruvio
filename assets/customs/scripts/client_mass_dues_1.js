function client_contract_finance_amount_update()
{
	total_amount = $('[name="total_amount"]').val()
	interest = $('[name="interest"]').val()
	if(total_amount && interest)
	{
		$('[name="finance_amount"]').val(calculate_finance_amount(total_amount, interest));	
		client_contract_dues_count_update();	
	}
}
function client_contract_dues_count_update()
{
	dues_amount = $('[name="dues_amount"]').val()
    first_payment_amount = $('[name="first_payment_amount"]').val()
	finance_amount = $('[name="finance_amount"]').val()
	if(finance_amount && dues_amount)
	{
        if(first_payment_amount > dues_amount)
        {
            $('[name="first_payment_amount"]').val(dues_amount);
            first_payment_amount = dues_amount;
        }
		dues_count = calculate_dues_count(finance_amount - first_payment_amount, dues_amount);
		$('[name="dues_count"]').val(dues_count + 1);            		
	}	
}
function client_contract_dues_amount_update()
{
	dues_count = $('[name="dues_count"]').val()
	finance_amount = $('[name="finance_amount"]').val()
	if(finance_amount && dues_count)
	{
		dues_amount = calculate_dues_amount(finance_amount, dues_count);
		$('[name="dues_amount"]').val(dues_amount);
		$('[name="first_payment_amount"]').val(dues_amount);		
	}	
}


$(document).ready(function() {
    $('[name="total_amount"], [name="interest"]').change(function(){
        if($('[name="total_amount"]').val() < 0)
            $('[name="total_amount"]').val(0)
        if($('[name="interest"]').val() < 0)
            $('[name="interest"]').val(0)
    	client_contract_finance_amount_update()
    })
    $('[name="dues_count"]').change(function(){
        if($('[name="dues_count"]').val() < 0)
            $('[name="dues_count"]').val(0)
    	client_contract_dues_amount_update()
    })
    $('[name="dues_amount"]').change(function(){
        if($('[name="dues_amount"]').val() < 0)
            $('[name="dues_amount"]').val(0)
    	client_contract_dues_count_update()
    })
    $('[name="first_payment_amount"]').change(function(){
        if($('[name="first_payment_amount"]').val() < 0)
            $('[name="first_payment_amount"]').val(0)
    })
    $('#create_dues').click(function(){
    	finance_amount = $('[name="finance_amount"]').val()
    	dues_amount = $('[name="dues_amount"]').val()
    	first_payment_amount = $('[name="first_payment_amount"]').val()
    	first_payment_date = $('[name="first_payment_date"]').val()
    	weeks_frequency = $('[name="weeks_frequency"]').val()
        if(!finance_amount)
            alert_error('Monto Financiar Obligatorio','El Monto a Financiar es Obligatorio para Generar las Cuotas')
        if(!dues_amount)
            alert_error('Monto Cuotas Obligatorio','El Monto de las Cuotas es Obligatorio para Generar las Cuotas')
        if(!first_payment_amount)
            alert_error('Monto Primer Pago Obligatorio','El Monto del Primer Pago es Obligatorio para Generar las Cuotas')
        if(!first_payment_date)
            alert_error('Fecha Primer Pago Obligatoria','La Fecha del Primer Pago es Obligatoria para Generar las Cuotas')
        if(!weeks_frequency)
            alert_error('Frecuencia de Pagos Obligatoria','La Frecuencia de Pagos es Obligatoria para Generar las Cuotas')

        frequency_value = $('[name="weeks_frequency"] option:selected').data('frequency-value');
        frequency_unit = $('[name="weeks_frequency"] option:selected').data('frequency-unit');
        
    	if(finance_amount && dues_amount && first_payment_amount && first_payment_date && weeks_frequency)
    	{
    		dues = calculate_dues(parseFloat(finance_amount), parseFloat(dues_amount), parseFloat(first_payment_amount), first_payment_date, frequency_value, frequency_unit, []);
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
    
    $(document).on('click', '.add_selected_client', function() {        
        client_data = $(this).data('client-data');
        $('#clients_selected_list tbody').append(`
        <tr>
            <td class="all">
                <input type="hidden" name="clients[]" value="${client_data.client_id}">
                ${client_data.full_name}
            </td>
            <td class="all">${client_data.ci}</td>
            <td class="all">${client_data.client_status_label}</td>
            <td class="all">${client_data.cars}</td>
            <td class="all">
                <button data-client-data='${JSON.stringify(client_data)}' type="button" class="btn btn-outline btn-circle btn-sm red remove_selected_client"><i class="fa fa-times"></i> Eliminar </button>
            </td>
        </tr>
        `)
        $(this).parent().parent().remove()
    })

    $(document).on('click', '.remove_selected_client', function() {        
        client_data = $(this).data('client-data');
        var index = selected_clients.indexOf(client_data.client_id);
        if (index > -1) {
            selected_clients.splice(index, 1);
        }
        $(this).parent().parent().remove()
    })
    $('#add_status_client').click(function() {
        selected_status = $('#filter_clients_list [name="status"]').val();
        if(selected_status) {
            clients.forEach(function(client_data) {
                if(client_data.client_status == selected_status && !selected_clients.includes(client_data.client_id)) {
                    selected_clients.push(client_data.client_id)
                    $('#clients_selected_list tbody').append(`
                    <tr>
                        <td class="all">
                            <input type="hidden" name="clients[]" value="${client_data.client_id}">
                            ${client_data.full_name}
                        </td>
                        <td class="all">${client_data.ci}</td>
                        <td class="all">${client_data.client_status_label}</td>
                        <td class="all">
                            <select name="cars[]" class="form-control" style="width:130px;${client_data.cars.length != 1 ? 'border-color:red;' : ''}">
                            <option value="">Sin unidad</option>
                            ${client_data.cars.map(function(car){return `<option value="${car.car_id}" ${client_data.cars.length == 1 ? 'selected' : ''}>${car.identifier}</option>`}).join('')}
                            <select/>
                        </td>
                        <td class="all">
                            <button data-client-data='${JSON.stringify(client_data)}' type="button" class="btn btn-outline btn-circle btn-sm red remove_selected_client"><i class="fa fa-times"></i> Eliminar </button>
                        </td>
                    </tr>
                    `)
                }
            })
        }
    })
    $('#add_filter_client').click(function() {
        var filtered_clients = $('#filtered_clients').val()
        if(filtered_clients) {
            filtered_clients.forEach(function(filtered_client_id){
                clients.forEach(function(client_data) {
                    if(client_data.client_id == filtered_client_id && !selected_clients.includes(client_data.client_id)) {
                        selected_clients.push(client_data.client_id)
                        $('#clients_selected_list tbody').append(`
                        <tr>
                            <td class="all">
                                <input type="hidden" name="clients[]" value="${client_data.client_id}">
                                ${client_data.full_name}
                            </td>
                            <td class="all">${client_data.ci}</td>
                            <td class="all">${client_data.client_status_label}</td>
                            <td class="all">
                                <select name="cars[]" class="form-control" style="width:130px;${client_data.cars.length != 1 ? 'border-color:red;' : ''}">
                                <option value="">Sin unidad</option>
                                ${client_data.cars.map(function(car){return `<option value="${car.car_id}" ${client_data.cars.length == 1 ? 'selected' : ''}>${car.identifier}</option>`}).join('')}
                                <select/>
                            </td>
                            <td class="all">
                                <button data-client-data='${JSON.stringify(client_data)}' type="button" class="btn btn-outline btn-circle btn-sm red remove_selected_client"><i class="fa fa-times"></i> Eliminar </button>
                            </td>
                        </tr>
                        `)
                    }
                })
            })
        }
    })

    if(clients_error)
        alert_error('Clientes Seleccionados', clients_error)
});
