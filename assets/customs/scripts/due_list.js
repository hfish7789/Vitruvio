$(document).ready(function() {
    var due_list_dt_table = initializeAjaxDatatable('due_list', ajax_list_url,'due_list_filter_form',function(settings){
        $('#total_amount').text("")
        $('#total_paid_amount').text("")
        $('#total_nc_amount').text("")
        $('#total_unpaid_amount').text("")
    	$.post(ajax_list_sum_url, settings.oAjaxData,function(data){
            $('#total_amount').text(data.total)
            $('#total_paid_amount').text(data.amount_paid)
            $('#total_nc_amount').text(data.credit_note_paid)
            $('#total_unpaid_amount').text(data.pending_amount)
        },'json')
        
    });
    $('[name="date_from"], [name="date_to"]').change(function(){
        $('[name="week"], [name="pending_week"], [name="year"]').val('')
    	due_list_dt_table.api().ajax.reload();
    })
    $('[name="week"], [name="year"]').change(function(){
        $('[name="date_from"], [name="date_to"], [name="pending_week"]').val('')
        $('[name="week"]').val(('0' + $('[name="week"]').val()).slice(-2))
        due_list_dt_table.api().ajax.reload();
    })
    $('[name="pending_week"]').change(function(){
        $('[name="date_from"], [name="date_to"], [name="week"]').val('')
        due_list_dt_table.api().ajax.reload();
    })
    $('[name="type\[\]"], [name="status\[\]"]').change(function(){
        due_list_dt_table.api().ajax.reload();
    })
    $(document).on('click','.get_client_data',function(e){
        e.preventDefault();
    	show_modal_client_data($(this).data('client-id'))
    })

    $('#resume_payment').click(function(){
        var formData = $("#due_list_filter_form").serializeArray();
        var filterFormData = {}; // string -> list<string> map for filter form
 
        // Generating multimap to serialize in traditional way
        for (var i in formData) {
            var field = formData[i];
            var existing = filterFormData[field["name"]];
            if (existing) {
                existing.push(field["value"]);
                filterFormData[field["name"]] = existing;
            } else {
                filterFormData[field["name"]] = [field["value"]];
            }
        }
        $.post(resume_list_url, $.param(filterFormData, true), function(response){
            if(response.status)
            {
                modal_title = 'Resumen de Pagos';
                if($('[name="date_from"]').val())
                {
                    modal_title += ' desde '+$('[name="date_from"]').val()+' hasta '+$('[name="date_to"]').val()
                }
                if($('[name="week"]').val())
                {
                    modal_title += ' de la semana '+$('[name="week"]').val()+' de '+$('[name="year"]').val()
                }   
                $('#modal_data .modal-title').html(modal_title);
                $('#modal_data .modal-body').html('');

                payment_due_data_left_container = $('<div class="col-md-12"></div>');

                payment_due_data_left_container.append($($('#modal_data .table_model').html()));
                payment_due_data_left_container.find('table thead tr').append('<th>Cuota</th>').append('<th>Total</th>').append('<th>Pagado</th>').append('<th>Préstamo</th>').append('<th>Pendiente</th>')

                total = 0;
                total_paid = 0;
                total_credit_note = 0;
                total_pending = 0;
                for (var type in response.data.types) {
                    amount = (type in response.data.payment_dues && response.data.payment_dues[type].amount)?response.data.payment_dues[type].amount:'0.00';
                    amount_paid = (type in response.data.payment_dues && response.data.payment_dues[type].amount_paid)?response.data.payment_dues[type].amount_paid:'0.00';
                    credit_note = (type in response.data.payment_dues && response.data.payment_dues[type].credit_note)?response.data.payment_dues[type].credit_note:'0.00';
                    pending = (type in response.data.payment_dues && response.data.payment_dues[type].pending)?response.data.payment_dues[type].pending:'0.00';
                    
                    payment_due_data_left_container.find('table tbody').append('<tr><td>'+response.data.types[type]+'</td><td>'+amount+'</td><td>'+amount_paid+'</td><td>'+credit_note+'</td><td>'+pending+'</td></tr>')
                }   

                payment_due_data_left_container.find('table tbody').append('<tr><td>Total</td><td>'+response.data.total+'</td><td>'+response.data.total_paid+'</td><td>'+response.data.total_credit_note+'</td><td>'+response.data.total_pending+'</td></tr>')    

                $('#modal_data .modal-body').append($('<div class="row"></div>').append(payment_due_data_left_container));

                $('#modal_data').modal();
            }
            else
                alert_error('Error Ajax');
        },'json')  
    });       
});