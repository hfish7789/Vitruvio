$(document).ready(function() {
    var contract_list_dt_table = initializeAjaxDatatable('contract_list', ajax_list_url,'contract_list_filter_form',function(settings){
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
        $('[name="week"]').val('')
        $('[name="year"]').val('')
    	contract_list_dt_table.api().ajax.reload();
    })
    $('[name="week"], [name="year"]').change(function(){
        $('[name="date_from"], [name="date_to"]').val('')
        $('[name="week"]').val(('0' + $('[name="week"]').val()).slice(-2))
        contract_list_dt_table.api().ajax.reload();
    })    
    $('[name="type\[\]"], [name="status"]').change(function(){
        contract_list_dt_table.api().ajax.reload();
    })
    $(document).on('click','.get_client_data',function(e){
        e.preventDefault();
    	show_modal_client_data($(this).data('client-id'))
    })
    $(document).on('click','.get_contract_data',function(e){
        e.preventDefault();
        contract_type = $(this).data('contract-type')
        contract_id = $(this).data('contract-id')
        switch(contract_type) {
            case 'client':
                show_modal_client_contract_data(contract_id)
                break;
            case 'car':
                show_modal_car_contract_data(contract_id)
                break;
            case 'car_client':
                show_modal_car_client_contract_data(contract_id)
                break;            
        }
    })
});