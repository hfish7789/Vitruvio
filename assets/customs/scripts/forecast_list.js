$(document).ready(function() {
    initializeDatatable('forecast_list',20);
    $('[name="week"], [name="year"]').change(function(){
    	$('[name="week"]').val(('0' + $('[name="week"]').val()).slice(-2))
    	document.location.href = forecast_list_url+'?week='+$('[name="week"]').val()+'&year='+$('[name="year"]').val();
    })
    $('#total_amount').text(total_amount)

    $(document).on('click','.get_retire_balance_data',function(e){
    	e.preventDefault();
    	show_modal_retire_balance_data($(this).data('week'), $(this).data('type'))
    })
});