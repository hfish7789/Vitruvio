$(document).ready(function() {
    var quota_list_dt_table = initializeAjaxDatatable('history_list', ajax_list_url,'quota_list_filter_form');
    $(document).on('confirmed.bs.confirmation','.quota_delete', function () {
        window.location.href = $(this).data('href');
    });
    $('[name="date_from"], [name="date_to"], [name="quota_status"]').change(function(){
    	quota_list_dt_table.api().ajax.reload();
    })

    $(document).on('confirmed.bs.confirmation','.quota_cancel', function () {
        var quota_cancel_href = $(this).data('href');
        bootbox.prompt("Comentarios *", function(result) {
            if (result != '' && !(result === null)) {
                var form = document.createElement("form");
                form.setAttribute("method", 'post');
                form.setAttribute("action", quota_cancel_href);
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
});