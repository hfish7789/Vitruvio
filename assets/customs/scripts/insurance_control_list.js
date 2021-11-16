$(document).ready(function() {
    var insurance_control_list_dt_table = initializeAjaxDatatable('insurance_control_list', ajax_list_url,'insurance_control_list_filter_form');
    $(document).on('confirmed.bs.confirmation','.insurance_control_delete', function () {
        window.location.href = $(this).data('href');
    });
    $('[name="date_from"], [name="date_to"], [name="insurance_control_status"]').change(function(){
    	insurance_control_list_dt_table.api().ajax.reload();
    })
});