$(document).ready(function() {
    var status_list_dt_table = initializeAjaxDatatable('status_list', ajax_list_url,'status_list_filter_form');

    $('[name="date_from"], [name="date_to"], [name="status"], [name="type"]').change(function(){
        status_list_dt_table.api().ajax.reload();
    })
});