$(document).ready(function(){
	$('[name="client_id"]').change(function(){
		if($(this).val())
		{
			$.getJSON(credit_note_url+'ajax_get_unpaid_dues/'+$(this).val(), function(response){
				if(response.status)
				{
					$('#dues_credit_notes_container table tbody tr').remove();
            
					response.data.forEach(function(due){
						select_days = `<select class="form-control due_cover_days" data-payment-amount="`+due.amount+`" data-pending-amount="`+due.payment_amount+`" data-days-frequency="`+due.days_frequency+`"><option value="0">Sin Cobertura</option>`;
						for (var i = 1; i <= due.days_frequency; i++) {
							disabled = '';
							if((i + due.days_paid) > due.days_frequency)
								disabled = 'disabled'
							select_days += `<option value="`+i+`" `+disabled+`>`+i+` Dia(s)</option>`;
						}
						select_days += `</select>`;
				    	due_row = `
					            <tr>
					                <td><input type="hidden" name="due_ids[]" value="`+due.due_id+`">`+` (`+due.formatted_date+`)</td>
					                <td>`+due.car+`</td>
					                <td>`+due.payment_amount.toFixed(2)+`</td>
					                <td>`+select_days+`<input class="form-control due_payment_amount" type="number" min="0"  data-pending-amount="`+due.payment_amount+`" name="due_payment_amounts[]"  `+(is_logged_in_admin?'':'readonly')+`></td>
					            </tr>`;
					    $('#dues_credit_notes_container table tbody').append(due_row);
				    });					
				}
				else
					alert_error('Error Ajax');
			})
		}
	})
	

    $(document).on('change','.due_cover_days', function(){
    	payment_amount = $(this).data('payment-amount');
    	pending_amount = $(this).data('pending-amount');
    	cover_days = $(this).val();
    	days_frequency = $(this).data('days-frequency');
    	cover_days_amount = dues_round(Math.min((cover_days/days_frequency)*payment_amount,pending_amount),2);
    	$(this).parent().find('input.due_payment_amount').val(cover_days_amount);
    	calculate_credit_note_total_amount();
    })

    $(document).on('change','.due_payment_amount', function(){
        payment_value = parseFloat($(this).val());
        if(payment_value < 0)
            payment_value = 0
        pending_amount = $(this).data('pending-amount');
        $(this).val(dues_round(Math.min(payment_value, pending_amount),2));
        calculate_credit_note_total_amount();
    })    
})
function calculate_credit_note_total_amount()
{
	total_amount = 0;
	$('.due_payment_amount').each(function(){
		if($(this).val())
			total_amount += parseFloat($(this).val());
	})
	$('[name="amount"]').val(dues_round(total_amount,2))
}