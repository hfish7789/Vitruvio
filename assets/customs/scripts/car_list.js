$(document).ready(function() {
    var car_list_dt_table = initializeAjaxDatatable('car_list', ajax_list_url,'car_list_filter_form');
    $(document).on('confirmed.bs.confirmation','.car_delete', function () {
        window.location.href = $(this).data('href');
    });
    $('[name="make_id"], [name="model_id"], [name="purchase_date_from"], [name="purchase_date_to"], [name="year"], [name="status"]').change(function(){
    	car_list_dt_table.api().ajax.reload();
    })
});