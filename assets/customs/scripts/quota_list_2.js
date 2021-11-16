$(document).ready(function () {
    // var quota_list_dt_table = initializeAjaxDatatable('quota_list', ajax_list_url, 'quota_list_filter_form');
    $(document).on('confirmed.bs.confirmation', '.quota_delete', function () {
        window.location.href = $(this).data('href');
    });
    $('[name="date_from"], [name="date_to"], [name="quota_status"]').change(function () {
        // quota_list_dt_table.api().ajax.reload();
    })

    $(document).on('confirmed.bs.confirmation', '.quota_cancel', function () {
        console.log('ddd');
        var quota_cancel_href = $(this).data('href');
        bootbox.prompt("Comentarios *", function (result) {
            console.log('dd===d');
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
    $('#quota_list').dataTable();

    // drawTable();
});

function drawTable() {
    var data = {};
    console.log(ajax_list_url)
    $.post(ajax_list_url, null, function (response) {
        response = JSON.parse(response);
        var html = '';
        html = `
            <thead>
                <tr>
                    <th class="all">Cupo</th>
                    <th class="all">Cliente</th>
                    <th class="all">Unidad</th>
                    <th class="all">Propiedad</th>
                    <th class="all">Tipo de Cupo</th>
                    <th class="all">Estado</th>
                    <th class="all">Matricula</th>
                    <th class="all">Renovacion</th>
                    <th class="all" data-orderable="false">Acciones</th>
                </tr>
            </thead>
        `;
        html += '<tbody>';
        for (var i = 0; i < response.length; i++) {
            html += `
                <tr>
                    <td>${response[i][0]}</td>
                    <td>${response[i][1]}</td>
                    <td>${response[i][2] == null ? "" : response[i][2]}</td>
                    <td>${response[i][3]}</td>
                    <td>${response[i][4]}</td>
                    <td>${response[i][5]}</td>
                    <td>${response[i][6] == null ? "" : response[i][6]}</td>
                    <td>${response[i][7]}</td>
                    <td>${response[i][8]}</td>
                </tr>
            `
        }
        html += '</tbody>';
        $('#quota_list').empty();
        $('#quota_list').append(html);
        $('#quota_list').dataTable();
    });
}