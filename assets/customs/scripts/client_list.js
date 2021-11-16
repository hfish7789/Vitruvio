$(document).ready(function() {
    var client_list_dt_table = initializeAjaxDatatable('client_list', ajax_list_url,'client_list_filter_form');
    $(document).on('confirmed.bs.confirmation','.client_delete', function () {
        window.location.href = $(this).data('href');
    });
    $('[name="status"]').change(function(){
        client_list_dt_table.api().ajax.reload();
    }) 
});