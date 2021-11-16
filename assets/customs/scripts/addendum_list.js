$(document).ready(function() {
    var addendum_list_dt_table = initializeAjaxDatatable('addendum_list', ajax_list_url,'addendum_list_filter_form',function(settings){
    	$('#total_amount').text(settings.json.all_data.total)
    	$('#total_paid_amount').text(settings.json.all_data.amount_paid)
    	$('#total_unpaid_amount').text(settings.json.all_data.pending_amount)
        $('#total_interest_amount').text(settings.json.all_data.interest_amount)
        $('#total_retired_amount').text(settings.json.all_data.retired_amount)
    });
    $('[name="client_id"], [name="type"], [name="status"]').change(function(){
    	addendum_list_dt_table.api().ajax.reload();
    })
    $('[name="date_from"], [name="date_to"]').change(function(){
        $('[name="week"], [name="year"]').val('')
        addendum_list_dt_table.api().ajax.reload();
    })
    $('[name="week"], [name="year"]').change(function(){
        $('[name="date_from"], [name="date_to"]').val('')
        $('[name="week"]').val(('0' + $('[name="week"]').val()).slice(-2))
        addendum_list_dt_table.api().ajax.reload();
    })
    $(document).on('click','.get_addendum_data',function(e){
        e.preventDefault();
    	show_modal_addendum_data($(this).data('addendum-id'))
    })
    $(document).on('click','.get_client_data',function(e){
        e.preventDefault();
        show_modal_client_data($(this).data('client-id'))
    })
    $(document).on('confirmed.bs.confirmation','.addendum_cancel', function () {
        var addendum_cancel_href = $(this).data('href');
        bootbox.prompt("Comentarios *", function(result) {
            if (result != '' && !(result === null)) {
                var form = document.createElement("form");
                form.setAttribute("method", 'post');
                form.setAttribute("action", addendum_cancel_href);
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", 'comments');
                hiddenField.setAttribute("value", result);

                form.appendChild(hiddenField);
                document.body.appendChild(form);
                form.submit();
            }
            else if (!(result === null)) {
                alert_error('Comentarios Obligatorios');
            }
        });        
    });
    $(document).on('confirmed.bs.confirmation','.addendum_delete', function () {
        window.location.href = $(this).data('href');
    });
});