$(document).ready(function() {
    var payment_list_dt_table = initializeAjaxDatatable('payment_list', ajax_list_url,'payment_list_filter_form',function(settings){
        $('.total_account').text('0')
        $('.total_account').parent().css('display','none');
        $('.account_closed').each(function(){
            $(this).parent().css('display','none');
        })
        
        for (var account_id in settings.json.account_all_data) {
            account_obj = $('#total_account_' + account_id);
            account_value = settings.json.account_all_data[account_id]
            account_obj.text(account_value);
            if(account_value != '0')
                account_obj.parent().css('display','inline-block');
        }
        $('.total_payment_type').css('display','none');
        for (var type in settings.json.type_all_data) {
            $('#total_payment_type_' + type + ' span').text(settings.json.type_all_data[type]);
            $('#total_payment_type_' + type).css('display','inline-block');
        }
        $('#total_amount').text(settings.json.total_amount);
    });
    $(document).on('confirmed.bs.confirmation','.payment_delete', function () {
        var delete_payment_href = $(this).data('href');
        var retired_payment = $(this).data('retired-payment');
        bootbox.prompt("Comentarios *", function(result) {
            if (result != '' && !(result === null)) {
                var form = document.createElement("form");
                form.setAttribute("method", 'post');
                form.setAttribute("action", delete_payment_href);
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", 'comments');
                hiddenField.setAttribute("value", result);

                form.appendChild(hiddenField);
                document.body.appendChild(form);

                if(retired_payment == '1')
                {
                    bootbox.prompt("Clave Operacion *", function(result) {
                        if (result != '' && !(result === null)) {
                            var hiddenField = document.createElement("input");
                            hiddenField.setAttribute("type", "hidden");
                            hiddenField.setAttribute("name", 'operation_password');
                            hiddenField.setAttribute("value", result);

                            form.appendChild(hiddenField);
                            document.body.appendChild(form);
                            form.submit();
                        }
                        else if (!(result === null)) {
                            alert_error('Clave Operacion Obligatoria');
                        }
                    });
                }
                else
                    form.submit();
            }
            else if (!(result === null)) {
                alert_error('Comentarios Obligatorios');
            }
        });        
    });
    $('[name="account_id"], [name="type\[\]"], [name="status"], [name="application_week"]').change(function(){
    	payment_list_dt_table.api().ajax.reload();
    })
    $('[name="date_from"], [name="date_to"]').change(function(){
        $('[name="week"], [name="year"]').val('')
        payment_list_dt_table.api().ajax.reload();
    })
    $('[name="week"], [name="year"]').change(function(){
        $('[name="date_from"], [name="date_to"]').val('')
        $('[name="week"]').val(('0' + $('[name="week"]').val()).slice(-2))
        payment_list_dt_table.api().ajax.reload();
    })
    $('[name="application_week"]').change(function(){
        $('[name="application_week"]').val(('0' + $('[name="application_week"]').val()).slice(-2))
    })
    $(document).on('click','.get_payment_data',function(e){
        e.preventDefault();
    	show_modal_payment_data($(this).data('payment-id'))
    })
    $(document).on('click','.print_payment_receipt',function(e){
        e.preventDefault();
        print_receipt($(this).data('payment-receipt-url'))
    })
    $(document).on('click','.get_client_data',function(e){
        e.preventDefault();
        show_modal_client_data($(this).data('client-id'))
    })
    if(payment_receipt_url)
        print_receipt(payment_receipt_url)
    $('#resume_payment').click(function(){
        var formData = $("#payment_list_filter_form").serializeArray();
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
                
                $('#modal_data .modal-body').html('');
                $('#modal_data .modal_to_remove').remove();

                payment_due_data_left_container = $('<div class="col-md-6"></div>');

                payment_due_data_left_container.append($($('#modal_data .table_model').html()));
                payment_due_data_left_container.find('table thead tr').append('<th>Cuota</th>').append('<th>Abonado</th>')

                payment_due_data_right_container = $('<div class="col-md-6"></div>');

                payment_due_data_right_container.append($($('#modal_data .table_model').html()));
                payment_due_data_right_container.find('table thead tr').append('<th>Cuota</th>').append('<th>Abonado</th>')

                type_keys = Object.keys(response.data.types);
                for (var type in response.data.types) {
                    amount_paid = (type in response.data.payment_dues && response.data.payment_dues[type].amount_paid)?response.data.payment_dues[type].amount_paid:'0.00';
                    
                    if(type_keys.indexOf(type) < (type_keys.length/2))
                        payment_due_data_left_container.find('table tbody').append('<tr><td>'+response.data.types[type]+'</td><td>'+amount_paid+'</td></tr>')
                    else
                        payment_due_data_right_container.find('table tbody').append('<tr><td>'+response.data.types[type]+'</td><td>'+amount_paid+'</td></tr>')
                }  

                modal_title += '<button class="btn sbold blue modal_to_remove" style="display: inline-block;float: right;"> Total: '+response.data.total+'</button>' 
                $('#modal_data .modal-title').html(modal_title);
                
                $('#modal_data .modal-body').append($('<div class="row"></div>').append(payment_due_data_left_container).append(payment_due_data_right_container));

                $('#modal_data').modal();
            }
            else
                alert_error('Error Ajax');
        },'json')  
    });
    $('#close_daily').click(function(e){
        prev_report();
        e.preventDefault();
        $('#print_iframe').attr('src',daily_close_url+'?date_from='+encodeURI(current_date)+'&date_to='+encodeURI(current_date)); 
    })       
    
});

function prev_report() {
    Cookies.remove('download_finished', { path: '/' });
    show_loading();
    setTimeout(function(){ check_download_finished(); }, 500);
}

function check_download_finished() {
    if(Cookies.get('download_finished'))
    {
        hide_loading()
    }
    else
    {
        setTimeout(function(){ check_download_finished(); }, 500);
    }
}