$(document).ready(function () {
	var is_car = false;
	var is_client = false;
	$('#payment_insert_form').submit(function () {
		$('#payment_insert_form [type="submit"]').attr('disabled', 'disabled');
	})
	$('[name="car_id"]').change(function () {
		is_car = true;
		if (is_client) {
			is_client = false;
			return;
		}
		if ($('[name="car_id"]').val() == '') {
			$('[name="client_id"]').val('').trigger('change');
		}
		if ($(this).val()) {
			$.getJSON(general_url + 'ajax_get_active_client_from_car/' + $(this).val(), function (response) {
				if (response.status) {
					if (response.data.client_id)
						$('[name="client_id"]').val(response.data.client_id).trigger('change');
					else {
						$('[name="client_id"]').val('').trigger('change');
					}
				}
				else
					alert_error('Error Ajax');
			})
		}
	})
	$('[name="amount"]').change(function () {
		if ($('[name="amount"]').val() < 0) {
			$('[name="amount"]').val('').trigger('change');
		}
		client_id = $('[name="client_id"]').val();
		amount = $('[name="amount"]').val();
		$('#dues_payments_container table tbody tr, #dues_payments_container table thead tr').remove();
		$('#show_one_week_container').css('display', 'none');
		$('#hide_one_week_container').css('display', 'none');
		$('#payment_save_container').css('display', 'none');
		if (client_id && amount && amount > 0) {
			$.getJSON(payment_url + 'ajax_get_dues_for_payment', { client_id: client_id, amount: amount }, function (response) {
 				if (response.status) {
					$('#show_one_week_container').css('display', 'block');
					$('#hide_one_week_container').css('display', 'block');
					header_row = `
				            <th class="text-center">Cuota</th>
				            <th class="text-center total_column" colspan="3">Total</th>
				            `;
					header_bottom_row = `
				            <th></th>
				            <th class="text-center total_column">Total</th>
				            <th class="text-center total_column">Abonado</th>
				            <th class="text-center total_column">Pendiente</th>				            
				            `;
					current_week = -1;
					current_year = -1;
					weeks = [];
					years = [];
					week_identifiers = [];
					table_data = {};
					visible_week_count = 0;
					total_pending = {};
					total_payment = {};
					for (var i = 0; i < response.data.unpaid_dues.length; i++) {
						unpaid_due = response.data.unpaid_dues[i]
						if (unpaid_due.week != current_week || unpaid_due.year != current_year) {
							current_week = unpaid_due.week;
							current_year = unpaid_due.year;
							weeks.push(current_week);
							years.push(current_year);
							week_identifier = current_year.toString() + '_' + current_week.toString();
							week_identifiers.push(week_identifier);
							header_class = (response.data.current_week == unpaid_due.week && response.data.current_year == unpaid_due.year) ? 'current_week' : (unpaid_due.date >= response.data.future_first_date ? 'future_due' : '');
							header_row += `
				            <th class="text-center `+ header_class + `" colspan="3">Semana ` + current_week + ` - ` + unpaid_due.year + `</th>
				            `;
							header_bottom_row += `
				            <th class="text-center `+ header_class + `">Monto</th><th class="text-center ` + header_class + `">Fecha</th><th class="text-center ` + header_class + `">Pago</th>
				            `;
							if (unpaid_due.date < response.data.future_first_date)
								visible_week_count += 1;
						}
						due_identifier = get_due_identifier(unpaid_due);
						if (!(due_identifier in table_data)) {
							table_data[due_identifier] = { due: unpaid_due.type, contract_id: unpaid_due.contract_id, due_type: unpaid_due.due_type, max_rows: 0, data: {} }
							total_pending[due_identifier] = 0;
							total_payment[due_identifier] = 0;
						}

						if (!(week_identifier in table_data[due_identifier]['data']))
							table_data[due_identifier]['data'][week_identifier] = [];
						table_data[due_identifier]['data'][week_identifier].push(get_due_partial_row(unpaid_due, unpaid_due.date >= response.data.future_first_date, response.data.current_week));
						try {
							if (table_data[due_identifier]['data'][week_identifier].length > table_data[due_identifier]['max_rows'])
								table_data[due_identifier]['max_rows'] = table_data[due_identifier]['data'][week_identifier].length;
						}
						catch {
							console.log(due_identifier)
						}


						if (unpaid_due.date <= response.data.current_date)
							total_pending[due_identifier] += parseFloat(unpaid_due.pending_amount);
						if (unpaid_due.pending)
							total_payment[due_identifier] += parseFloat(unpaid_due.payment_amount);

					}

					$('#dues_payments_container table thead').append('<tr>' + header_row + '</tr>');
					$('#dues_payments_container table thead').append('<tr>' + header_bottom_row + '</tr>');

					table_data_keys = Object.keys(table_data);
					table_data_keys.sort();

					

					for (var k = 0; k < table_data_keys.length; k++) {
						due_identifier = table_data_keys[k]

						due_detail = table_data[due_identifier];
						for (var i = 0; i < due_detail['max_rows']; i++) {
							body_row = `<tr data-due-identifier="` + due_identifier + `" class="` + (i == 0 ? `due_main` : `due_secondary hidden`) + `">`;
							if (i == 0) {
								expander = '';
								if (due_detail['max_rows'] > 1) {
									expander = '<span class="expander fa fa-plus-circle"></span> ';
									body_row += `<td>` + expander + table_data[due_identifier]['due'] + `</td>`
								} else {
									body_row += `<td><a href="#" data-contract-type="` + table_data[due_identifier]['due_type'] + `" data-contract-id="` + table_data[due_identifier]['contract_id'] + `" class="green get_contract_data">` + table_data[due_identifier]['due'] + `</a></td>`
								}
								// body_row += `<td>`+expander+table_data[due_identifier]['due']+`</td>`;
								total_pending[due_identifier] = dues_round(total_pending[due_identifier], 2)
								total_payment[due_identifier] = dues_round(total_payment[due_identifier], 2)
								body_row += `<td class="total_pending total_column">` + total_pending[due_identifier] + `</td>`;
								body_row += `<td class="total_payment total_column">` + total_payment[due_identifier] + `</td>`;
								body_row += `<td class="total_difference total_column">` + dues_round(total_pending[due_identifier] - total_payment[due_identifier], 2) + `</td>`;
							}
							else {
								body_row += `<td></td><td></td><td></td><td></td>`;
							}
							for (var j = 0; j < weeks.length; j++) {
								week = weeks[j];
								year = years[j];
								week_identifier = week_identifiers[j];
								if (week_identifier in table_data[due_identifier]['data'] && i < table_data[due_identifier]['data'][week_identifier].length)
									body_row += table_data[due_identifier]['data'][week_identifier][i];
								else {
									cell_class = ((week == response.data.current_week && year == response.data.current_year) ? ' current_week' : (visible_week_count <= j ? ' future_due' : ''));
									body_row += `<td class="` + cell_class + `"></td><td class="` + cell_class + `"></td><td class="` + cell_class + `"></td>`;
								}
							}
							body_row += `</tr>`;
							$('#dues_payments_container table tbody').append(body_row);
						}
					}
					$('.get_contract_data').click(function (e) {
						e.preventDefault();
						contract_type = $(this).data('contract-type')
						contract_id = $(this).data('contract-id')
						console.log("==================", contract_id, contract_type)
						switch (contract_type) {
							case 'client':
								show_modal_client_contract_data(contract_id)
								break;
							case 'car':
								show_modal_car_contract_data(contract_id)
								break;
							case 'car_client':
								show_modal_car_client_contract_data(contract_id)
								break;
							case 'credit_note':
								show_modal_credit_note_data(contract_id)
								break;
							case 'addendum':
								show_modal_addendum_data(contract_id)
								break;
						}
					})
					console.log(response.data.pending_amount, 'amount')
					$('[name="pending_amount"]').val(response.data.pending_amount);
					if (response.data.pending_amount == "0")
						$('#payment_save_container').css('display', 'block');
					else
						$('#payment_save_container').css('display', 'none');
				}
				else
					alert_error('Error Ajax');
			});
		}
	})
	$('[name="client_id"]').change(function () {
		if ($('[name="client_id"]').val() == '' && !is_car) {
			$('[name="car_id"]').val('').trigger('change');
		}
		if ($('[name="amount"]').val() < 0) {
			$('[name="amount"]').val('').trigger('change');
		}
		client_id = $('[name="client_id"]').val();
		amount = $('[name="amount"]').val();
		$('#dues_payments_container table tbody tr, #dues_payments_container table thead tr').remove();
		$('#show_one_week_container').css('display', 'none');
		$('#hide_one_week_container').css('display', 'none');
		$('#payment_save_container').css('display', 'none');
		if (client_id && amount && amount > 0) {
			$.getJSON(payment_url + 'ajax_get_dues_for_payment', { client_id: client_id, amount: amount }, function (response) {
				if (response.status) {
					$('#show_one_week_container').css('display', 'block');
					$('#hide_one_week_container').css('display', 'block');
					header_row = `
				            <th class="text-center">Cuota</th>
				            <th class="text-center total_column" colspan="3">Total</th>
				            `;
					header_bottom_row = `
				            <th></th>
				            <th class="text-center total_column">Total</th>
				            <th class="text-center total_column">Abonado</th>
				            <th class="text-center total_column">Pendiente</th>				            
				            `;
					current_week = -1;
					current_year = -1;
					weeks = [];
					years = [];
					week_identifiers = [];
					table_data = {};
					visible_week_count = 0;
					total_pending = {};
					total_payment = {};
					for (var i = 0; i < response.data.unpaid_dues.length; i++) {
						unpaid_due = response.data.unpaid_dues[i]
						if (unpaid_due.week != current_week || unpaid_due.year != current_year) {
							current_week = unpaid_due.week;
							current_year = unpaid_due.year;
							weeks.push(current_week);
							years.push(current_year);
							week_identifier = current_year.toString() + '_' + current_week.toString();
							week_identifiers.push(week_identifier);
							header_class = (response.data.current_week == unpaid_due.week && response.data.current_year == unpaid_due.year) ? 'current_week' : (unpaid_due.date >= response.data.future_first_date ? 'future_due' : '');
							header_row += `
				            <th class="text-center `+ header_class + `" colspan="3">Semana ` + current_week + ` - ` + unpaid_due.year + `</th>
				            `;
							header_bottom_row += `
				            <th class="text-center `+ header_class + `">Monto</th><th class="text-center ` + header_class + `">Fecha</th><th class="text-center ` + header_class + `">Pago</th>
				            `;
							if (unpaid_due.date < response.data.future_first_date)
								visible_week_count += 1;
						}
						due_identifier = get_due_identifier(unpaid_due);
						if (!(due_identifier in table_data)) {
							table_data[due_identifier] = { due: unpaid_due.type, contract_id: unpaid_due.contract_id, due_type: unpaid_due.due_type, max_rows: 0, data: {} }
							total_pending[due_identifier] = 0;
							total_payment[due_identifier] = 0;
						}

						if (!(week_identifier in table_data[due_identifier]['data']))
							table_data[due_identifier]['data'][week_identifier] = [];
						table_data[due_identifier]['data'][week_identifier].push(get_due_partial_row(unpaid_due, unpaid_due.date >= response.data.future_first_date, response.data.current_week));
						try {
							if (table_data[due_identifier]['data'][week_identifier].length > table_data[due_identifier]['max_rows'])
								table_data[due_identifier]['max_rows'] = table_data[due_identifier]['data'][week_identifier].length;
						}	
						catch {
							console.log(due_identifier)
						}


						if (unpaid_due.date <= response.data.current_date)
							total_pending[due_identifier] += parseFloat(unpaid_due.pending_amount);
						if (unpaid_due.pending)
							total_payment[due_identifier] += parseFloat(unpaid_due.payment_amount);

					}

					$('#dues_payments_container table thead').append('<tr>' + header_row + '</tr>');
					$('#dues_payments_container table thead').append('<tr>' + header_bottom_row + '</tr>');

					table_data_keys = Object.keys(table_data);
					table_data_keys.sort();
					console.log(32323223,table_data_keys)
					for (var k = 0; k < table_data_keys.length; k++) {
						due_identifier = table_data_keys[k]

						due_detail = table_data[due_identifier];
						for (var i = 0; i < due_detail['max_rows']; i++) {
							console.log(1111,i,due_detail['due'])
							body_row = `<tr data-due-identifier="` + due_identifier + `" class="` + (i == 0 ? `due_main` : `due_secondary hidden`) + `">`;
							if (i == 0) {
								expander = '';
								if (due_detail['max_rows'] > 1) {
									expander = '<span class="expander fa fa-plus-circle"></span> ';
									body_row += `<td>` + expander + table_data[due_identifier]['due'] + `</td>`
								} else {
									body_row += `<td><a href="#" data-contract-type="` + table_data[due_identifier]['due_type'] + `" data-contract-id="` + table_data[due_identifier]['contract_id'] + `" class="green get_contract_data">` + table_data[due_identifier]['due'] + `</a></td>`
								}
								// body_row += `<td>`+expander+table_data[due_identifier]['due']+`</td>`;
								total_pending[due_identifier] = dues_round(total_pending[due_identifier], 2)
								total_payment[due_identifier] = dues_round(total_payment[due_identifier], 2)
								body_row += `<td class="total_pending total_column">` + total_pending[due_identifier] + `</td>`;
								body_row += `<td class="total_payment total_column">` + total_payment[due_identifier] + `</td>`;
								body_row += `<td class="total_difference total_column">` + dues_round(total_pending[due_identifier] - total_payment[due_identifier], 2) + `</td>`;
							}
							else {
								body_row += `<td></td><td></td><td></td><td></td>`;
							}
							for (var j = 0; j < weeks.length; j++) {
								week = weeks[j];
								year = years[j];
								week_identifier = week_identifiers[j];
								if (week_identifier in table_data[due_identifier]['data'] && i < table_data[due_identifier]['data'][week_identifier].length)
									body_row += table_data[due_identifier]['data'][week_identifier][i];
								else {
									cell_class = ((week == response.data.current_week && year == response.data.current_year) ? ' current_week' : (visible_week_count <= j ? ' future_due' : ''));
									body_row += `<td class="` + cell_class + `"></td><td class="` + cell_class + `"></td><td class="` + cell_class + `"></td>`;
								}
							}
							console.log(3333,body_row)
							body_row += `</tr>`;
							$('#dues_payments_container table tbody').append(body_row);
						}
					}
					$('.get_contract_data').click(function (e) {
						e.preventDefault();
						contract_type = $(this).data('contract-type')
						contract_id = $(this).data('contract-id')
						switch (contract_type) {
							case 'client':
								show_modal_client_contract_data(contract_id)
								break;
							case 'car':
								show_modal_car_contract_data(contract_id)
								break;
							case 'car_client':
								show_modal_car_client_contract_data(contract_id)
								break;
							case 'credit_note':
								show_modal_credit_note_data(contract_id)
								break;
							case 'addendum':
								show_modal_addendum_data(contract_id)
								break;
						}
					})
					$('[name="pending_amount"]').val(response.data.pending_amount);
					if (response.data.pending_amount == "0")
						$('#payment_save_container').css('display', 'block');
					else
						$('#payment_save_container').css('display', 'none');
				}
				else
					alert_error('Error Ajax');
			});
		}
		if (is_car) {
			is_car = false;
			return;
		}
		if (client_id) {
			$.getJSON(general_url + 'ajax_get_active_cars_from_client/' + client_id, function (response) {
				if (response.status) {
					is_client = true;
					if (response.data.length > 0)
						$('[name="car_id"]').val(response.data[0].car_id).trigger('change');
					else
						$('[name="car_id"]').val('').trigger('change');
				}
				else
					alert_error('Error Ajax');
			})
		}

	})

	$(document).on('change', '.due_payment_amount', function () {
		due_type = $(this).data('due-type');
		if (due_type == 'credit_note' && $(this).val() > 0) {
			credit_note_interests = $('.due_payment_amount[data-due-type="credit_note_interest"]')
			for (credit_note_interest of credit_note_interests) {
				if ($(credit_note_interest).val() < $(credit_note_interest).data('payment-amount')) {
					$(this).val(0)
					alert_error('Primero debe pagar los intereses de nota de credito')
					return;
				}
			}
		}

		if ($(this).val() < 0) {
			$(this).val('0');
		}

		amount = $('[name="amount"]').val();
		assigned_amount = 0;
		$('.due_payment_amount').each(function () {
			if ($(this).val())
				assigned_amount += parseFloat($(this).val());
		})
		new_amount = $(this).val() ? parseFloat($(this).val()) : 0;
		pending_amount = amount - assigned_amount + new_amount;
		if (new_amount > $(this).data('payment-amount'))
			new_amount = $(this).data('payment-amount');
		if (new_amount > pending_amount)
			new_amount = pending_amount;
		pending_amount = dues_round(pending_amount - new_amount, 2);
		$('[name="pending_amount"]').val(pending_amount);
		new_amount = dues_round(new_amount, 2);
		$(this).val(new_amount);
		if (pending_amount == 0)
			$('#payment_save_container').css('display', 'block');
		else
			$('#payment_save_container').css('display', 'none');

		assigned_amount_per_row = {}
		$('.due_payment_amount').each(function () {
			if ($(this).val()) {
				due_identifier = $(this).data('due-identifier');
				if (!(due_identifier in assigned_amount_per_row))
					assigned_amount_per_row[due_identifier] = 0;
				assigned_amount_per_row[due_identifier] += parseFloat($(this).val());
			}
		})
		for (var due_identifier in assigned_amount_per_row) {
			assigned_amount_row = assigned_amount_per_row[due_identifier];
			$('#dues_payments_container table tbody tr[data-due-identifier="' + due_identifier + '"] td.total_payment').html(dues_round(assigned_amount_row, 2));
			$('#dues_payments_container table tbody tr[data-due-identifier="' + due_identifier + '"] td.total_difference').html(dues_round($('#dues_payments_container table tbody tr[data-due-identifier="' + due_identifier + '"] td.total_pending').html() - assigned_amount_row, 2));
		}
	})

	$(document).on('click', 'td span.expander', function () {
		if ($(this).hasClass('fa-plus-circle')) {
			$(this).removeClass('fa-plus-circle')
			$(this).addClass('fa-minus-circle')
		}
		else {
			$(this).removeClass('fa-minus-circle')
			$(this).addClass('fa-plus-circle')
		}
		parent = $(this).parent().parent().next();
		while (parent.hasClass('due_secondary')) {
			if (parent.hasClass('hidden'))
				parent.removeClass('hidden')
			else
				parent.addClass('hidden')
			parent = parent.next()
		}
	})

	$('#show_one_week').click(function () {
		$('#dues_payments_container table thead tr').first().find('th.future_due').first().removeClass('future_due')
		$('#dues_payments_container table thead tr').slice(1, 2).find('th.future_due').slice(0, 3).removeClass('future_due')

		$('#dues_payments_container table tbody tr').each(function () {
			$(this).find('td.future_due').slice(0, 3).removeClass('future_due')
		})
	})
	$('#hide_one_week').click(function () {
		$('#dues_payments_container table thead tr').first().find('th:not(.future_due)').last().addClass('future_due')
		$('#dues_payments_container table thead tr').slice(1, 2).find('th:not(.future_due)').slice(-3).addClass('future_due')

		$('#dues_payments_container table tbody tr').each(function () {
			$(this).find('td:not(.future_due)').slice(-3).addClass('future_due')
		})
	})
	$('#pending').change(function () {
		var checked = $(this).is(':checked')
		$('#client_container').css('display', checked ? 'none' : 'block')
		$('#car_container').css('display', checked ? 'none' : 'block')
		$('[name="client_id"]').val('').trigger('change')
		$('[name="car_id"]').val('').trigger('change')

		$('#payment_save_container').css('display', checked ? 'block' : 'none');

		$('#pending_amount_container').css('display', checked ? 'none' : 'block')
	})

})

function get_due_partial_row(due, future, current_week) {
	due_identifier = get_due_identifier(due);
	due_partial_row = `
	<td class="`+ (future ? 'future_due' : '') + `` + (current_week == due.week ? ' current_week' : '') + `">` + dues_round(due.pending_amount, 2) + `</td>
	<td class="`+ (future ? 'future_due' : '') + `` + (current_week == due.week ? ' current_week' : '') + `"><input type="hidden" name="due_ids[]" value="` + due.due_id + `"><input type="hidden" name="due_types[]" value="` + due.due_type + `"><input type="hidden" name="due_dates[]" value="` + due.date + `">` + due.formatted_date + `</td>
	<td class="`+ (future ? 'future_due' : '') + `` + (current_week == due.week ? ' current_week' : '') + `"><input class="form-control due_payment_amount" type="number" min="0" data-payment-amount="` + due.pending_amount + `" data-due-identifier="` + due_identifier + `" data-due-type="` + due.due_type + `" name="due_payment_amounts[]" ` + ((due.pending && !is_admin) ? (`readonly`) : ``) + (due.pending ? (` value="` + due.payment_amount + `"`) : ``) + `></td>
	`;
	return due_partial_row;
}
function get_due_identifier(due) {
	due_identifier = due.due_type + due.contract_id;
	switch (due.due_type) {
		case 'addendum':
			due_identifier = '001' +due_identifier
		case 'car_client':
			due_identifier = '1' + due_identifier
			break;
		case 'car_client_surcharge':
			due_identifier = '2' + due_identifier
			break;
		case 'client':
			due_identifier = '3' + due_identifier
			break;
		case 'car':
			due_identifier = '4' + due_identifier
			break;
		case 'credit_note_interest':
			due_identifier = '5' + due_identifier
			break;
		case 'credit_note':
			due_identifier = '6' + due_identifier
			break;
	}
	return due_identifier
}