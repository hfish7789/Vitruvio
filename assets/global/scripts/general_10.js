function format_date(date_to_format)
{
	var day = '' + date_to_format.getDate();
    var month = (parseInt(date_to_format.getMonth()) + 1).toString();
	if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    var year = date_to_format.getFullYear().toString().substr(2,2);
    return day+'/'+month+'/'+year;
}
function create_date(date_str)
{
	current_date_create = new Date()
	date_split = date_str.split("/");
	date = parseInt(date_split[0]);
	month = parseInt(date_split[1]);
	year = current_date_create.getFullYear().toString().substr(0,2) + date_split[2];
	return new Date(year, month -1, date);
}
function format_number(number)
{
	return number.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
}
function yyyy_mm_dd(date) {
	month = '' + (date.getMonth() + 1),
	day = '' + date.getDate(),
	year = date.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return [year, month, day].join('-');
}
function dues_round(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
}
function add_days(date, days) {
    var result = new Date(date);
    result.setDate(date.getDate() + days);
    return result;
}
function add_months(date, months) {
    var result = new Date(date);
    result.setMonth(result.getMonth()+months);
    return result;
}
function get_7_22_add_days(first_payment_date, ahead_count)
{
	last_month_date = new Date(first_payment_date.getFullYear(), first_payment_date.getMonth(), 22);
    middle_month_date = new Date(first_payment_date.getFullYear(), first_payment_date.getMonth(), 7);
    next_month_middle_month_date = new Date(first_payment_date.getFullYear(), first_payment_date.getMonth() + 1, 7);

    next_date = (first_payment_date <= middle_month_date) ? middle_month_date : ((first_payment_date <= last_month_date) ? last_month_date : next_month_middle_month_date);

    for (let index = 1; index <= ahead_count; index++) {
        if(next_date.getDate() == 7) {
            next_date.setDate(22);
        }     
        else {
            next_date = add_months(next_date, 1)
            next_date.setDate(7)
        }    
    }
    return next_date; 
}
function get_15_30_add_days(first_payment_date, ahead_count)
{
	last_month_date = new Date(first_payment_date.getFullYear(), first_payment_date.getMonth() + 1, 0);
    middle_month_date = new Date(first_payment_date.getFullYear(), first_payment_date.getMonth(), 15);

    next_date = (first_payment_date <= middle_month_date) ? middle_month_date : last_month_date;

    for (let index = 1; index <= ahead_count; index++) {
        if(next_date.getDate() == 15) {
            next_date = new Date(next_date.getFullYear(), next_date.getMonth() + 1, 0);
        }     
        else {
            next_date = add_days(next_date, 15)
        }    
    }
    return next_date;    
}
function days_diference(first_date, second_date) {
	var one_day = 24*60*60*1000; // hours*minutes*seconds*milliseconds
	return Math.round(Math.abs((first_date.getTime() - second_date.getTime())/(one_day)));
}
function calculate_finance_amount(total_amount, interest)
{
	return dues_round(total_amount * parseFloat('1.'+interest),2);
}
function calculate_dues_amount(finance_amount, dues_count)
{
	return dues_round(finance_amount/dues_count,2);
}
function calculate_dues_count(finance_amount, dues_amount, dues_amount_2, dues_amount_3)
{
	if(dues_amount_2 === undefined)
		dues_amount_2 = dues_amount;
	if(dues_amount_3 === undefined)
		dues_amount_3 = dues_amount

	dues_count = 0;

	finance_amount_1 = Math.min(finance_amount, dues_amount * 51);
	finance_amount -= finance_amount_1
	dues_count += Math.ceil(finance_amount_1/dues_amount);
	
	finance_amount_2 = Math.min(finance_amount, dues_amount_2 * 52);
	finance_amount -= finance_amount_2
	dues_count += Math.ceil(finance_amount_2/dues_amount_2);

	finance_amount_3 = finance_amount;
	finance_amount -= finance_amount_3
	dues_count += Math.ceil(finance_amount_3/dues_amount_3);
	
	return dues_count;
}
function calculate_dues(finance_amount, dues_amount, first_payment_amount, first_payment_date, frequency_value, frequency_unit, dates_not_pay, dues_amount_2, dues_amount_3)
{
	if(dues_amount_2 === undefined)
		dues_amount_2 = dues_amount;
	if(dues_amount_3 === undefined)
		dues_amount_3 = dues_amount

	dues_count = calculate_dues_count(finance_amount-first_payment_amount,dues_amount,dues_amount_2,dues_amount_3)
	dues = []	
	current_date = create_date(first_payment_date);
	payment_amount = parseFloat(first_payment_amount);
	payment_total_amount = 0
	for (var i = 1; i <= dues_count; i++) {
		if(i >= 52 && i < 104)
			dues_amount = dues_amount_2
		else if(i >= 104)
			dues_amount = dues_amount_3

		switch(frequency_unit)
		{
			case 'day':
				days_add = i*frequency_value;
				days_add_number = frequency_value;				
				break
			case 'week':
				days_add = i*frequency_value * 7;
				days_add_number = frequency_value * 7;
				break
			case 'month':
				days_add = days_diference(create_date(first_payment_date), add_months(create_date(first_payment_date), i*frequency_value));
				days_add_number = frequency_value;
				break
			case 'biweekly_7_22':
				if(i == 1)
				{
					first_payment_date = format_date(get_7_22_add_days(create_date(first_payment_date), i - 1));
					current_date = create_date(first_payment_date);
				}		
				next_date = get_7_22_add_days(create_date(first_payment_date), i);
				days_add = days_diference(create_date(first_payment_date), next_date);
				days_add_number = days_diference(next_date, get_7_22_add_days(create_date(first_payment_date), i + 1));
			 	break
			 case 'biweekly_15_30':
				if(i == 1)
				{
					first_payment_date = format_date(get_15_30_add_days(create_date(first_payment_date), i - 1));
					current_date = create_date(first_payment_date);
				}		
				next_date = get_15_30_add_days(create_date(first_payment_date), i);
				days_add = days_diference(create_date(first_payment_date), next_date);
				days_add_number = days_diference(next_date, get_15_30_add_days(create_date(first_payment_date), i + 1));
			 	break
		}
		payment_amount = dues_round(payment_amount,2);
		days_remove_number = days_add_number - Math.floor(days_add_number/7);
		payment_total_amount += payment_amount;
		dues.push({date : current_date, amount : payment_amount})
		prev_date = current_date;		
		current_date = add_days(create_date(first_payment_date), days_add);
		payment_amount = dues_amount;
		inside_dates = dates_not_pay.filter(function(date) {
      		return date > prev_date && date <= current_date;
		})		
		if(inside_dates.length > 0)
		{
			console.log(days_remove_number);
			payment_amount -= (dues_amount/days_remove_number)*inside_dates.length;
		}

		if(frequency_unit == 'day' && frequency_value == 1)
		{
			if(current_date.getDay() == 6)
				i += 1;
		}		
	}
	rest_amount = finance_amount - payment_total_amount;
	while(rest_amount > 0)
	{ 
		i = dues.length + 1
		if(i >= 52 && i < 104)
			dues_amount = dues_amount_2
		else if(i >= 104)
			dues_amount = dues_amount_3
		switch(frequency_unit)
		{
			case 'day':
				days_add = i*frequency_value;
				days_add_number = frequency_value;				
				break
			case 'week':
				days_add = i*frequency_value * 7;
				days_add_number = frequency_value * 7;
				break
			case 'month':
				days_add = days_diference(create_date(first_payment_date), add_months(create_date(first_payment_date), i*frequency_value));
				days_add_number = frequency_value;
				break
			case 'biweekly_7_22':
				if(i == 1)
				{
					first_payment_date = format_date(get_7_22_add_days(create_date(first_payment_date), i - 1));
					current_date = create_date(first_payment_date);
				}		
				next_date = get_7_22_add_days(create_date(first_payment_date), i);
				days_add = days_diference(create_date(first_payment_date), next_date);
				days_add_number = days_diference(next_date, get_7_22_add_days(create_date(first_payment_date), i + 1));
			 	break
		    case 'biweekly_15_30':
				if(i == 1)
				{
					first_payment_date = format_date(get_15_30_add_days(create_date(first_payment_date), i - 1));
					current_date = create_date(first_payment_date);
				}		
				next_date = get_15_30_add_days(create_date(first_payment_date), i);
				days_add = days_diference(create_date(first_payment_date), next_date);
				days_add_number = days_diference(next_date, get_15_30_add_days(create_date(first_payment_date), i + 1));
			 	break
		}
		rest_amount = dues_round(rest_amount, 2);
		if(rest_amount > dues_amount)
		{
			payment_amount = dues_amount;
			rest_amount -= dues_amount;
		}
		else
		{
			payment_amount = rest_amount;
			rest_amount = 0;
		}
		dues.push({date : current_date, amount : dues_round(payment_amount,2)})
		current_date = add_days(create_date(first_payment_date), days_add);
		i++;
	}
	return dues;
}
function show_modal_client_data(client_id)
{
	$.getJSON(general_url+'ajax_get_client_data/'+client_id, function(response){
		if(response.status)
		{
			$('.page-quick-sidebar-wrapper .page-quick-sidebar').html('');

			$('.page-quick-sidebar-wrapper .page-quick-sidebar').append('<row><iframe style="width:100%; height:'+document.body.scrollHeight+'px;border:none;" src="'+client_url+'view_short/'+response.data.client_id+'"></row>');

			$('body').toggleClass('page-quick-sidebar-open'); 
		}
		else
			alert_error('Error Ajax');
	})	
}

function show_modal_payment_data(payment_id)
{
	$.getJSON(general_url+'ajax_get_payment_data/'+payment_id, function(response){
		if(response.status)
		{
			$('#modal_data .modal-body').html('');
			$('#modal_data .modal_to_remove').remove();
			$('#modal_data .modal-dialog').addClass('modal-lg');

			payment_data_left_container = $('<div class="col-md-6"></div>');
			payment_data_right_container = $('<div class="col-md-6"></div>');

			modal_title = response.data.payment.reference+(response.data.payment.cancelled=="1"?(' (Cancelado por '+response.data.payment.cancel_user+' el '+response.data.payment.cancel_date_time+' Comentarios: '+response.data.payment.cancel_comments+')'):'');
			if(response.data.payment.cancelled=="0")
				modal_title += '<button type="button" data-payment-receipt-url="'+response.data.payment.print_receipt_payment_url+'" class="btn btn-outline btn-circle btn-sm blue print_payment_receipt pull-right" ><i class="fa fa-print"></i> Imprimir Recibo </button>'
			$('#modal_data .modal-title').html(modal_title);

			payment_date_time_container = $($('#modal_data .row_model').html());
			payment_date_time_container.find('label.sbold').text('Fecha/Hora: ');
			payment_date_time_container.find('.form-group').append(response.data.payment.payment_date_time);
			payment_data_left_container.append(payment_date_time_container);

			client_container = $($('#modal_data .row_model').html());
			client_container.find('label.sbold').text('Cliente: ');
			client_container.find('.form-group').append(response.data.payment.client);
			payment_data_left_container.append(client_container);

			car_container = $($('#modal_data .row_model').html());
			car_container.find('label.sbold').text('Carro: ');
			car_container.find('.form-group').append(response.data.payment.cars);
			payment_data_left_container.append(car_container);

			account_container = $($('#modal_data .row_model').html());
			account_container.find('label.sbold').text('Cuenta: ');
			account_container.find('.form-group').append(response.data.payment.account);
			payment_data_left_container.append(account_container);

			account_reference_container = $($('#modal_data .row_model').html());
			account_reference_container.find('label.sbold').text('Referencia Bancaria: ');
			account_reference_container.find('.form-group').append(response.data.payment.account_reference);
			payment_data_left_container.append(account_reference_container);

			amount_container = $($('#modal_data .row_model').html());
			amount_container.find('label.sbold').text('Cantidad: ');
			amount_container.find('.form-group').append(response.data.payment.amount);
			payment_data_right_container.append(amount_container);

			user_container = $($('#modal_data .row_model').html());
			user_container.find('label.sbold').text('Usuario: ');
			user_container.find('.form-group').append(response.data.payment.user);
			payment_data_right_container.append(user_container);

			remark_container = $($('#modal_data .row_model').html());
			remark_container.find('label.sbold').text('Observaciones: ');
			remark_container.find('.form-group').append(response.data.payment.remarks);
			payment_data_right_container.append(remark_container);

			receipt_detail_container = $($('#modal_data .row_model').html());
			receipt_detail_container.find('label.sbold').text('Recibo: ');
			receipt_detail_container.find('.form-group').append(response.data.payment.receipt_detail);
			payment_data_right_container.append(receipt_detail_container);

			due_payments_data_container = $('<div class="col-md-12" style="overflow-x:scroll;"></div>');

			due_payments_data_container.append($($('#modal_data .table_model').html()));

			header_row = `
		            <th class="text-center">Cuota</th>
		            <th class="text-center">Total</th>
		            `;
		    header_bottom_row = `
		            <th></th>
		            <th></th>
		            `;
		    current_week = -1;
		    weeks = [];
		    table_data = {};
		    visible_week_count = 0;
		    total_payment = {};
		    for (var i = 0; i < response.data.due_payments.length; i++) {
		    	due_payment = response.data.due_payments[i]
		    	if(due_payment.week != current_week)
		    	{
		    		current_week = due_payment.week;
		    		weeks.push(current_week);
		    		header_row += `
		            <th class="text-center" colspan="2">Semana `+current_week+`</th>
		            `;
		            header_bottom_row += `
		            <th class="text-center">Monto</th><th class="text-center">Fecha</th>
		            `;
		            visible_week_count += 1;
		    	}

		    	due_identifier = due_payment.due_type+due_payment.contract_id;
		    	if(!(due_identifier in table_data))
		    	{
		    		table_data[due_identifier] = {due:due_payment.type, max_rows:0, data:{}}
		    		total_payment[due_identifier] = 0;
		    	}
		    	if(!(current_week in table_data[due_identifier]['data']))
		    		table_data[due_identifier]['data'][current_week] = [];
		    	table_data[due_identifier]['data'][current_week].push('<td>'+due_payment.amount+'</td><td>'+due_payment.date+'</td>');
		    	if(table_data[due_identifier]['data'][current_week].length > table_data[due_identifier]['max_rows'])
		    		table_data[due_identifier]['max_rows'] = table_data[due_identifier]['data'][current_week].length;
		    	total_payment[due_identifier] += parseFloat(due_payment.amount);		    	
		    }
		    due_payments_data_container.find('table thead').append('<tr>'+header_row+'</tr>');
		    due_payments_data_container.find('table thead').append('<tr>'+header_bottom_row+'</tr>');

		    for (var due_identifier in table_data) {
			    due_detail = table_data[due_identifier];
			    for (var i = 0; i < due_detail['max_rows']; i++) {
			    	body_row = `<tr>`;
			    	if(i == 0)
			    	{
			    		body_row += `<td>`+table_data[due_identifier]['due']+`</td>`;
			    		body_row += `<td>`+dues_round(total_payment[due_identifier],2)+`</td>`;
			    	}
			    	else
			    	{
			    		body_row += `<td></td><td></td>`;
			    	}
			    	for (var j = 0; j < weeks.length; j++) {
			    		week = weeks[j];
			    		if(week in table_data[due_identifier]['data'] && i < table_data[due_identifier]['data'][week].length)					    	
			    			body_row += table_data[due_identifier]['data'][week][i];
			    		else
			    			body_row += `<td></td><td></td>`;
			    	}
			    	body_row += `</tr>`;
			    	due_payments_data_container.find('table tbody').append(body_row);
			    }
			}

			$('#modal_data .modal-body').append($('<div class="row"></div>').append(payment_data_left_container).append(payment_data_right_container).append(due_payments_data_container));

			$('#modal_data').modal();
		}
		else
			alert_error('Error Ajax');
	})	
}

function show_modal_car_client_contract_data(car_client_contract_id)
{
	role = 0;
	$.getJSON(general_url+'is_superadmin/',function(response){
		role = response;
	})
	$.getJSON(general_url+'ajax_get_car_client_contract_data/'+car_client_contract_id, function(response){
		if(response.status)
		{
			$('#modal_data .modal-body').html('');
			$('#modal_data .modal_to_remove').remove();

			left_data_container = $('<div class="col-md-6"></div>');
			console.log(response.data);
			modal_title = response.data.reference+' '+response.data.car+' al cliente '+response.data.client+(response.data.status=="retired"?(' (Retirado por '+response.data.retire_user+' el '+response.data.retire_date_time+' Comentarios: '+response.data.retire_comments+')'):'');
			$('#modal_data .modal-title').html(modal_title);

			car_container = $($('#modal_data .row_model').html());
			car_container.find('label.sbold').text('Carro: ');
			car_container.find('.form-group').append(response.data.car);
			left_data_container.append(car_container);

			client_container = $($('#modal_data .row_model').html());
			client_container.find('label.sbold').text('Cliente: ');
			client_container.find('.form-group').append(response.data.client);
			left_data_container.append(client_container);

			dues_count_container = $($('#modal_data .row_model').html());
			dues_count_container.find('label.sbold').text('Nro Cuotas: ');
			dues_count_container.find('.form-group').append(response.data.dues_count);
			left_data_container.append(dues_count_container);

			dues_amount_container = $($('#modal_data .row_model').html());
			dues_amount_container.find('label.sbold').text('Monto Cuotas 1: ');
			dues_amount_container.find('.form-group').append(response.data.dues_amount);
			left_data_container.append(dues_amount_container);

			dues_amount_container = $($('#modal_data .row_model').html());
			dues_amount_container.find('label.sbold').text('Monto Cuotas 2: ');
			dues_amount_container.find('.form-group').append(response.data.dues_amount_2);
			left_data_container.append(dues_amount_container);

			dues_amount_container = $($('#modal_data .row_model').html());
			dues_amount_container.find('label.sbold').text('Monto Cuotas 3: ');
			dues_amount_container.find('.form-group').append(response.data.dues_amount_3);
			left_data_container.append(dues_amount_container);

			first_payment_amount_container = $($('#modal_data .row_model').html());
			first_payment_amount_container.find('label.sbold').text('Monto Primer Pago: ');
			first_payment_amount_container.find('.form-group').append(response.data.first_payment_amount);
			left_data_container.append(first_payment_amount_container);

			first_payment_date_container = $($('#modal_data .row_model').html());
			first_payment_date_container.find('label.sbold').text('Fecha Primer Pago: ');
			first_payment_date_container.find('.form-group').append(response.data.first_payment_date);
			left_data_container.append(first_payment_date_container);

			days_frequency_container = $($('#modal_data .row_model').html());
			days_frequency_container.find('label.sbold').text('Frecuencia: ');
			days_frequency_container.find('.form-group').append(response.data.days_frequency);
			left_data_container.append(days_frequency_container);

			quota_container = $($('#modal_data .row_model').html());
			quota_container.find('label.sbold').text('Cupo: ');
			quota_container.find('.form-group').append(response.data.quota_number);
			left_data_container.append(quota_container);

			right_data_container = $('<div class="col-md-6"></div>');	

			holiday_payment_container = $($('#modal_data .row_model').html());
			holiday_payment_container.find('label.sbold').text('Pago Feriados: ');
			holiday_payment_container.find('.form-group').append(response.data.holiday_payment=='1'?'Si':'No');
			right_data_container.append(holiday_payment_container);

			car_deliver_date_container = $($('#modal_data .row_model').html());
			car_deliver_date_container.find('label.sbold').text('Fecha Entrega Vehiculo: ');
			car_deliver_date_container.find('.form-group').append(response.data.car_deliver_date);
			right_data_container.append(car_deliver_date_container);

			initial_amount_container = $($('#modal_data .row_model').html());
			initial_amount_container.find('label.sbold').text('Monto Inicial: ');
			initial_amount_container.find('.form-group').append(response.data.initial_amount);
			right_data_container.append(initial_amount_container);

			total_amount_container = $($('#modal_data .row_model').html());
			total_amount_container.find('label.sbold').text('Deuda Inicial: ');
			total_amount_container.find('.form-group').append(response.data.total_amount);
			right_data_container.append(total_amount_container);
			
			surcharge_container = $($('#modal_data .row_model').html());
			surcharge_container.find('label.sbold').text('Recargo: ');
			surcharge_container.find('.form-group').append('<input readonly id="surcharge" type="number" style="width: 20%; border: none" value="'+response.data.surcharge+'">');
			if(role == 1){
				surcharge_container.find('.form-group').append('<i id="edt_surcharge" style="font-size: 20px; margin-left: 10px;" class="fa fa-edit"></i>');
			}
			right_data_container.append(surcharge_container);

			comments_container = $($('#modal_data .row_model').html());
			comments_container.find('label.sbold').text('Comentarios: ');
			comments_container.find('.form-group').append(response.data.comments);
			right_data_container.append(comments_container);

			created_user_container = $($('#modal_data .row_model').html());
			created_user_container.find('label.sbold').text('Creado por: ');
			created_user_container.find('.form-group').append(response.data.created_user);
			right_data_container.append(created_user_container);				

			retire_user_container = $($('#modal_data .row_model').html());
			retire_user_container.find('label.sbold').text('Retirado por: ');
			retire_user_container.find('.form-group').append(response.data.retire_user);
			right_data_container.append(retire_user_container);

			$('#modal_data .modal-body').append($('<div class="row"></div>').append(left_data_container).append(right_data_container));

			$('#modal_data').modal();
			
			$('#edt_surcharge').on('click', function() {
				if($('#edt_surcharge').hasClass('fa-edit')) {
					$('#edt_surcharge').removeClass('fa-edit');
					$('#edt_surcharge').addClass('fa-save');
					$('#surcharge').attr('readonly', false);
				}else {
					data = {
						id: response.data.car_client_contract_id,
						surcharge: $('#surcharge').val()
					}
					console.log(data)
					$.ajax({
						type: "POST",
						url: client_url + "update_car_client_contract_data/", 
						data: data,
						cache:false,
						success: 
							 function(data){
							   alert(data);  //as a debugging message.
							 }
						 });// you have missed this bracket
					$('#edt_surcharge').removeClass('fa-save');
					$('#edt_surcharge').addClass('fa-edit');
					$('#surcharge').attr('readonly', true);
				}
			});
		}
		else
			alert_error('Error Ajax');
	})	
}

function show_modal_credit_note_data(credit_note_id)
{
	$.getJSON(general_url+'ajax_get_credit_note_data/'+credit_note_id, function(response){
		if(response.status)
		{
			$('#modal_data .modal-body').html('');
			$('#modal_data .modal_to_remove').remove();
			
			credit_note_data_container = $('<div class="col-md-6"></div>');
			console.log('===========88888============',response.data)
			modal_title = response.data.credit_note.reference+(response.data.credit_note.retired=="1"?' (Retirada)':(response.data.credit_note.canceled=="1"?(' (Cancelado por '+response.data.credit_note.cancel_user+' el '+response.data.credit_note.cancel_date_time+' Comentarios: '+response.data.credit_note.cancel_comments+')'):''));
			$('#modal_data .modal-title').html(modal_title);

			credit_note_date_time_container = $($('#modal_data .row_model').html());
			credit_note_date_time_container.find('label.sbold').text('Fecha/Hora Creado: ');
			credit_note_date_time_container.find('.form-group').append(response.data.credit_note.credit_note_date_time);
            credit_note_data_container.append(credit_note_date_time_container);

            credit_note_created_user_container = $($('#modal_data .row_model').html());
			credit_note_created_user_container.find('label.sbold').text('Creado por: ');
			credit_note_created_user_container.find('.form-group').append(response.data.credit_note.created_user);
            credit_note_data_container.append(credit_note_created_user_container);

			credit_note_client_container = $($('#modal_data .row_model').html());
			credit_note_client_container.find('label.sbold').text('Cliente: ');
			credit_note_client_container.find('.form-group').append(response.data.credit_note.client);
			credit_note_data_container.append(credit_note_client_container);

			credit_note_amount_container = $($('#modal_data .row_model').html());
			credit_note_amount_container.find('label.sbold').text('Monto: ');
			credit_note_amount_container.find('.form-group').append(response.data.credit_note.amount);
			credit_note_data_container.append(credit_note_amount_container);

			credit_note_with_interest_container = $($('#modal_data .row_model').html());
			credit_note_with_interest_container.find('label.sbold').text('Interes: ');
			credit_note_with_interest_container.find('.form-group').append(response.data.credit_note.with_interest=='1'?'Si':'No');
			credit_note_data_container.append(credit_note_with_interest_container);

			credit_note_remarks_container = $($('#modal_data .row_model').html());
			credit_note_remarks_container.find('label.sbold').text('Observaciones: ');
			credit_note_remarks_container.find('.form-group').append(response.data.credit_note.remarks);
			credit_note_data_container.append(credit_note_remarks_container);

			credit_note_due_data_container = $('<div class="col-md-6"></div>');

			credit_note_due_data_container.append($($('#modal_data .table_model').html()));
			credit_note_due_data_container.find('table thead tr').append('<th>Cuota</th>').append('<th>Monto</th>')

			response.data.credit_note_dues.forEach(function(credit_note_due){
				credit_note_due_data_container.find('table tbody').append('<tr><td>'+(credit_note_due.date+' ('+credit_note_due.car+')')+'</td><td>'+credit_note_due.amount+'</td></tr>')
			})			

			$('#modal_data .modal-body').append($('<div class="row"></div>').append(credit_note_data_container).append(credit_note_due_data_container));

			$('#modal_data').modal();
		}
		else
			alert_error('Error Ajax');
	})	
}

function show_modal_car_contract_data(car_contract_id)
{
	$.getJSON(general_url+'ajax_get_car_contract_data/'+car_contract_id, function(response){
		if(response.status)
		{
			$('#modal_data .modal-body').html('');
			$('#modal_data .modal_to_remove').remove();

			left_data_container = $('<div class="col-md-6"></div>');

			modal_title = response.data.reference + ' ' + response.data.car;
			if(response.data.retired=="1")
				modal_title += ' (Retirado por '+response.data.retire_user+' el '+response.data.retire_date_time+' Comentarios: '+response.data.retire_comments+')';
			else if(response.data.canceled=="1")
				modal_title += ' (Cancelado por '+response.data.cancel_user+' el '+response.data.cancel_date_time+' Comentarios: '+response.data.cancel_comments+')';
			$('#modal_data .modal-title').html(modal_title);

			car_contract_type_container = $($('#modal_data .row_model').html());
			car_contract_type_container.find('label.sbold').text('Tipo Contrato: ');
			car_contract_type_container.find('.form-group').append(response.data.car_contract_type);
			left_data_container.append(car_contract_type_container);

			dues_count_container = $($('#modal_data .row_model').html());
			dues_count_container.find('label.sbold').text('Nro Cuotas: ');
			dues_count_container.find('.form-group').append(response.data.dues_count);
			left_data_container.append(dues_count_container);

			dues_amount_container = $($('#modal_data .row_model').html());
			dues_amount_container.find('label.sbold').text('Monto Cuotas: ');
			dues_amount_container.find('.form-group').append(response.data.dues_amount);
			left_data_container.append(dues_amount_container);

			first_payment_amount_container = $($('#modal_data .row_model').html());
			first_payment_amount_container.find('label.sbold').text('Monto Primer Pago: ');
			first_payment_amount_container.find('.form-group').append(response.data.first_payment_amount);
            left_data_container.append(first_payment_amount_container);		
            
            comments_container = $($('#modal_data .row_model').html());
			comments_container.find('label.sbold').text('Comentarios: ');
			comments_container.find('.form-group').append(response.data.comments);
			left_data_container.append(comments_container);	

			right_data_container = $('<div class="col-md-6"></div>');	

			first_payment_date_container = $($('#modal_data .row_model').html());
			first_payment_date_container.find('label.sbold').text('Fecha Primer Pago: ');
			first_payment_date_container.find('.form-group').append(response.data.first_payment_date);
			right_data_container.append(first_payment_date_container);

			weeks_frequency_container = $($('#modal_data .row_model').html());
			weeks_frequency_container.find('label.sbold').text('Frecuencia: ');
			weeks_frequency_container.find('.form-group').append(response.data.weeks_frequency);
			right_data_container.append(weeks_frequency_container);

			total_amount_container = $($('#modal_data .row_model').html());
			total_amount_container.find('label.sbold').text('Total: ');
			total_amount_container.find('.form-group').append(response.data.total_amount);
			right_data_container.append(total_amount_container);

			created_user_container = $($('#modal_data .row_model').html());
			created_user_container.find('label.sbold').text('Creado por: ');
			created_user_container.find('.form-group').append(response.data.created_user);
			right_data_container.append(created_user_container);		
				
			retire_user_container = $($('#modal_data .row_model').html());
			retire_user_container.find('label.sbold').text('Retirado por: ');
			retire_user_container.find('.form-group').append(response.data.retire_user);
			right_data_container.append(retire_user_container);

			$('#modal_data .modal-body').append($('<div class="row"></div>').append(left_data_container).append(right_data_container));

			$('#modal_data').modal();
		}
		else
			alert_error('Error Ajax');
	})	
}

function show_modal_client_contract_data(client_contract_id)
{
	$.getJSON(general_url+'ajax_get_client_contract_data/'+client_contract_id, function(response){
		if(response.status)
		{
			$('#modal_data .modal-body').html('');
			$('#modal_data .modal_to_remove').remove();
			left_data_container = $('<div class="col-md-6"></div>');
			modal_title = response.data.reference+' '+response.data.client+(response.data.canceled=="1"?(' (Cancelado por '+response.data.cancel_user+' el '+response.data.cancel_date_time+' Comentarios: '+response.data.cancel_comments+')'):'');
			$('#modal_data .modal-title').html(modal_title);

			client_contract_type_container = $($('#modal_data .row_model').html());
			client_contract_type_container.find('label.sbold').text('Tipo Contrato: ');
			client_contract_type_container.find('.form-group').append(response.data.client_contract_type);
			left_data_container.append(client_contract_type_container);

			car_container = $($('#modal_data .row_model').html());
			car_container.find('label.sbold').text('Carro: ');
			car_container.find('.form-group').append(response.data.car);
			left_data_container.append(car_container);

			dues_count_container = $($('#modal_data .row_model').html());
			dues_count_container.find('label.sbold').text('Nro Cuotas: ');
			dues_count_container.find('.form-group').append(response.data.dues_count);
			left_data_container.append(dues_count_container);

			dues_amount_container = $($('#modal_data .row_model').html());
			dues_amount_container.find('label.sbold').text('Monto Cuotas: ');
			dues_amount_container.find('.form-group').append(response.data.dues_amount);
			left_data_container.append(dues_amount_container);

			first_payment_amount_container = $($('#modal_data .row_model').html());
			first_payment_amount_container.find('label.sbold').text('Monto Primer Pago: ');
			first_payment_amount_container.find('.form-group').append(response.data.first_payment_amount);
			left_data_container.append(first_payment_amount_container);	

			comments_container = $($('#modal_data .row_model').html());
			comments_container.find('label.sbold').text('Comentarios: ');
			comments_container.find('.form-group').append(response.data.comments);
			left_data_container.append(comments_container);			

			internal_use_container = $($('#modal_data .row_model').html());
			internal_use_container.find('label.sbold').text('Uso Interno: ');
			internal_use_container.find('.form-group').append(response.data.internal_use);
			left_data_container.append(internal_use_container);	

			right_data_container = $('<div class="col-md-6"></div>');	

			first_payment_date_container = $($('#modal_data .row_model').html());
			first_payment_date_container.find('label.sbold').text('Fecha Primer Pago: ');
			first_payment_date_container.find('.form-group').append(response.data.first_payment_date);
			right_data_container.append(first_payment_date_container);

			weeks_frequency_container = $($('#modal_data .row_model').html());
			weeks_frequency_container.find('label.sbold').text('Frecuencia: ');
			weeks_frequency_container.find('.form-group').append(response.data.weeks_frequency);
            right_data_container.append(weeks_frequency_container);

            total_amount_container = $($('#modal_data .row_model').html());
			total_amount_container.find('label.sbold').text('Total Factura: ');
			total_amount_container.find('.form-group').append(response.data.total_amount);
            right_data_container.append(total_amount_container);
            
            interest_container = $($('#modal_data .row_model').html());
			interest_container.find('label.sbold').text('Interes: ');
			interest_container.find('.form-group').append(response.data.interest + '% (' + (response.data.finance_amount - response.data.total_amount).toFixed(2) + ')');
			right_data_container.append(interest_container);

			finance_amount_container = $($('#modal_data .row_model').html());
			finance_amount_container.find('label.sbold').text('Monto Financiar: ');
			finance_amount_container.find('.form-group').append(response.data.finance_amount);
			right_data_container.append(finance_amount_container);					

			bill_container = $($('#modal_data .row_model').html());
			bill_container.find('label.sbold').text('Documento: ');
			bill_container.find('.form-group').append(response.data.bill);
			right_data_container.append(bill_container);

			created_user_container = $($('#modal_data .row_model').html());
			created_user_container.find('label.sbold').text('Creado por: ');
			created_user_container.find('.form-group').append(response.data.created_user);
			right_data_container.append(created_user_container);		
						
			retire_user_container = $($('#modal_data .row_model').html());
			retire_user_container.find('label.sbold').text('Retirado por: ');
			retire_user_container.find('.form-group').append(response.data.retire_user);
			right_data_container.append(retire_user_container);

			$('#modal_data .modal-body').append($('<div class="row"></div>').append(left_data_container).append(right_data_container));

			$('#modal_data').modal();
		}
		else
			alert_error('Error Ajax');
	})	
}

function print_receipt(receipt_url)
{
	$('#print_iframe').attr('src',receipt_url); 
}

function show_modal_retire_balance_data(week, type)
{
	$.getJSON(general_url+'ajax_get_retire_balance_data/'+week+'/'+type, function(response){
		if(response.status)
		{
			$('#modal_data .modal-body').html('');
			$('#modal_data .modal_to_remove').remove();

			modal_title = 'Saldo por Retirada (Semana '+week+') de '+response.data.type;
			$('#modal_data .modal-title').html(modal_title);			

			due_retire_balances_data_container = $('<div class="col-md-12" style="overflow-x:scroll;"></div>');

			due_retire_balances_data_container.append($($('#modal_data .table_model').html()));

			header_row = `
		            <th class="text-center">Cliente</th>
		            <th class="text-center">Carro</th>
		            <th class="text-center">Monto</th>
		            <th class="text-center">Monto Previo</th>
		            `;
            due_retire_balances_data_container.find('table thead').append('<tr>'+header_row+'</tr>');

		    for (var i = 0; i < response.data.retire_balances.length; i++) {
		    	retire_balance = response.data.retire_balances[i]
		    	body_row = `<tr>`;
		    	body_row += `<td>`+retire_balance.client+`</td>`;
		    	body_row += `<td>`+retire_balance.car+`</td>`;
		    	body_row += `<td>`+retire_balance.amount+`</td>`;
		    	body_row += `<td>`+retire_balance.amount_prev+`</td>`;	
		    	body_row += `</tr>`;
		    	due_retire_balances_data_container.find('table tbody').append(body_row);	    	
		    }

			$('#modal_data .modal-body').append($('<div class="row"></div>').append(due_retire_balances_data_container));

			$('#modal_data').modal();
		}
		else
			alert_error('Error Ajax');
	})	
}

function show_modal_car_contract_dues_data(car_contract_id)
{
	$.getJSON(general_url+'ajax_get_car_contract_dues_data/'+car_contract_id, function(response){
		if(response.status)
		{
			$('#modal_data .modal-body').html('');
			$('#modal_data .modal_to_remove').remove();

			modal_title = 'Cuotas de Contrato';
			$('#modal_data .modal-title').html(modal_title);			

			car_contract_dues_data_container = $('<div class="col-md-12" style="overflow-x:scroll;"></div>');

			car_contract_dues_data_container.append($($('#modal_data .table_model').html()));

			header_row = `
		            <th class="text-center">Fecha</th>
		            <th class="text-center">Cuota</th>
		            <th class="text-center">Abonado</th>
		            <th class="text-center">Pagado por</th>
		            `;
            car_contract_dues_data_container.find('table thead').append('<tr>'+header_row+'</tr>');

		    for (var i = 0; i < response.data.contract_dues.length; i++) {
		    	contract_due = response.data.contract_dues[i]
		    	body_row = `<tr>`;
		    	body_row += `<td>`+contract_due.date+`</td>`;
		    	body_row += `<td>`+contract_due.amount+`</td>`;
		    	body_row += `<td>`+contract_due.amount_paid+`</td>`;
		    	body_row += `<td>`+contract_due.clients+`</td>`;	
		    	body_row += `</tr>`;
		    	car_contract_dues_data_container.find('table tbody').append(body_row);	    	
		    }

			$('#modal_data .modal-body').append($('<div class="row"></div>').append(car_contract_dues_data_container));

			$('#modal_data').modal();
		}
		else
			alert_error('Error Ajax');
	})	
}

function show_modal_addendums_data(car_client_contract_id)
{
	$.getJSON(general_url+'ajax_get_car_client_contract_addendums_data/'+car_client_contract_id, function(response){
		if(response.status)
		{
			$('#modal_data .modal-body').html('');
			$('#modal_data .modal_to_remove').remove();

			modal_title = 'Adendas del Contrato';
			$('#modal_data .modal-title').html(modal_title);			

			addendums_data_container = $('<div class="col-md-12" style="overflow-x:scroll;"></div>');

			addendums_data_container.append($($('#modal_data .table_model').html()));

			header_row = `
		            <th class="text-center">Fecha</th>
		            <th class="text-center">Total</th>
		            <th class="text-center">Cuotas</th>
		            `;
            addendums_data_container.find('table thead').append('<tr>'+header_row+'</tr>');

		    for (var i = 0; i < response.data.addendums.length; i++) {
		    	addendum = response.data.addendums[i]
		    	body_row = `<tr>`;
		    	body_row += `<td>`+addendum.date+`</td>`;
		    	body_row += `<td>`+addendum.amount+`</td>`;
		    	body_row += `<td>`+addendum.dues_amount+`</td>`;
		    	body_row += `</tr>`;
		    	addendums_data_container.find('table tbody').append(body_row);	    	
		    }

			$('#modal_data .modal-body').append($('<div class="row"></div>').append(addendums_data_container));

			$('#modal_data').modal();
		}
		else
			alert_error('Error Ajax');
	})	
}

function show_modal_addendum_data(addendum_id)
{
	$.getJSON(general_url+'ajax_get_addendum_data/'+addendum_id, function(response){
		if(response.status)
		{
			$('#modal_data .modal-body').html('');
			$('#modal_data .modal_to_remove').remove();

			addendum_data_container = $('<div class="col-md-6"></div>');

			modal_title = response.data.addendum.reference+(response.data.addendum.retired=="1"?' (Retirada)':(response.data.addendum.canceled=="1"?(' (Cancelado por '+response.data.addendum.cancel_user+' el '+response.data.addendum.cancel_date_time+' Comentarios: '+response.data.addendum.cancel_comments+')'):''));
			$('#modal_data .modal-title').html(modal_title);

			addendum_date_time_container = $($('#modal_data .row_model').html());
			addendum_date_time_container.find('label.sbold').text('Fecha/Hora Creada: ');
			addendum_date_time_container.find('.form-group').append(response.data.addendum.addendum_date_time);
            addendum_data_container.append(addendum_date_time_container);
            
            addendum_created_by_container = $($('#modal_data .row_model').html());
			addendum_created_by_container.find('label.sbold').text('Creada por: ');
			addendum_created_by_container.find('.form-group').append(response.data.addendum.created_user);
			addendum_data_container.append(addendum_created_by_container);

			addendum_client_container = $($('#modal_data .row_model').html());
			addendum_client_container.find('label.sbold').text('Cliente: ');
			addendum_client_container.find('.form-group').append(response.data.addendum.client);
			addendum_data_container.append(addendum_client_container);

			cover_amount_container = $($('#modal_data .row_model').html());
			cover_amount_container.find('label.sbold').text('Monto base: ');
			cover_amount_container.find('.form-group').append(response.data.addendum.cover_amount);
            addendum_data_container.append(cover_amount_container);
			
			addendum_with_interest_container = $($('#modal_data .row_model').html());
			addendum_with_interest_container.find('label.sbold').text('Interes: ');
			addendum_with_interest_container.find('.form-group').append(response.data.addendum.additional_amount);
			addendum_data_container.append(addendum_with_interest_container);

			addendum_amount_container = $($('#modal_data .row_model').html());
			addendum_amount_container.find('label.sbold').text('Total: ');
			addendum_amount_container.find('.form-group').append(response.data.addendum.amount);
			addendum_data_container.append(addendum_amount_container);

			addendum_type_container = $($('#modal_data .row_model').html());
			addendum_type_container.find('label.sbold').text('Tipo: ');
			addendum_type_container.find('.form-group').append(response.data.addendum.type_label);
            addendum_data_container.append(addendum_type_container);

            if(response.data.addendum.type == 'addendum_cash') {
                addendum_check_number_container = $($('#modal_data .row_model').html());
                addendum_check_number_container.find('label.sbold').text('Numero de Cheque: ');
                addendum_check_number_container.find('.form-group').append(response.data.addendum.check_number);
                addendum_data_container.append(addendum_check_number_container);
            }

            if(response.data.addendum.type == 'addendum_workshop') {
                addendum_invoice_number_container = $($('#modal_data .row_model').html());
                addendum_invoice_number_container.find('label.sbold').text('Numero de Factura: ');
                addendum_invoice_number_container.find('.form-group').append(response.data.addendum.invoice_number);
                addendum_data_container.append(addendum_invoice_number_container);
            }
			console.log(response.data);
			addendum_remarks_container = $($('#modal_data .row_model').html());
			addendum_remarks_container.find('label.sbold').text('Observaciones: ');
			addendum_remarks_container.find('.form-group').append(response.data.addendum.remarks);
			addendum_data_container.append(addendum_remarks_container);

			first_payment_date_container = $($('#modal_data .row_model').html());
			first_payment_date_container.find('label.sbold').text('Fecha del primer pago: ');
			first_payment_date_container.find('.form-group').append(response.data.addendum.first_payment_date);
			addendum_data_container.append(first_payment_date_container);

			created_user_container = $($('#modal_data .row_model').html());
			created_user_container.find('label.sbold').text('Creado por: ');
			created_user_container.find('.form-group').append(response.data.addendum.created_user);
			addendum_data_container.append(created_user_container);

			dues_amount_container = $($('#modal_data .row_model').html());
			dues_amount_container.find('label.sbold').text('Cuotas: ');
			dues_amount_container.find('.form-group').append(response.data.addendum.dues_amount);
			addendum_data_container.append(dues_amount_container);

			dues_number_container = $($('#modal_data .row_model').html());
			dues_number_container.find('label.sbold').text('No. de Cuotas: ');
			dues_number_container.find('.form-group').append(response.data.addendum.dues_count);
			addendum_data_container.append(dues_number_container);

			retire_user_container = $($('#modal_data .row_model').html());
			retire_user_container.find('label.sbold').text('Retirado por: ');
			retire_user_container.find('.form-group').append(response.data.addendum.retire_user);
			addendum_data_container.append(retire_user_container);

			addendum_due_data_container = $('<div class="col-md-6"></div>');

			addendum_due_data_container.append($($('#modal_data .table_model').html()));
			addendum_due_data_container.find('table thead tr').append('<th>Cuota</th>').append('<th>Monto</th>')

			total_dues = (response.data.addendum.type == 'addendum_workshop' || response.data.addendum.type == 'addendum_cash') ? parseFloat(response.data.addendum.cover_amount,10) : 0;
			response.data.addendum_dues.forEach(function(addendum_due){
				total_dues += parseFloat(addendum_due.amount);
				addendum_due_data_container.find('table tbody').append('<tr><td>'+(addendum_due.date+' ('+addendum_due.car+')')+'</td><td>'+addendum_due.amount+'</td></tr>')
			})		
			addendum_due_data_container.find('table tbody').append('<tr><td>Monto Base</td><td>'+total_dues.toFixed(2)+'</td></tr>')	

			addendum_contract_id = $($('#modal_data .row_model').html());
			addendum_contract_id.find('label.sbold').text('Contratos ID: CL-');
			addendum_contract_id.find('.form-group').append(response.data.addendum.car_client_contract_id);
			addendum_due_data_container.append(addendum_contract_id);

			$('#modal_data .modal-body').append($('<div class="row"></div>').append(addendum_data_container).append(addendum_due_data_container));

			$('#modal_data').modal();
		}
		else
			alert_error('Error Ajax');
	})	
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteCookie(cname) {
	var d = new Date(); //Create an date object
    d.setTime(d.getTime() - (1000*60*60*24)); //Set the time to the past. 1000 milliseonds = 1 second
    var expires = "expires=" + d.toGMTString(); //Compose the expirartion date
    document.cookie = cname+"="+"; "+expires;//Set the cookie with name and the expiration date

}

function show_loading(text) 
{
	$('#loading').show();
}
function hide_loading(text) 
{
	$('#loading').hide();
}