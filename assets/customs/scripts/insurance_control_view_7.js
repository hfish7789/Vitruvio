$(document).ready(function () {
    $(document).on('confirmed.bs.confirmation', '.insurance_control_amount_delete', function () {
        window.location.href = $(this).data('href');
    });
    $('[name="date_from"], [name="date_to"]').change(function(){
        $('[name="week"], [name="year"]').val('')
        getReceiptData();
    })
    $('[name="account_id"], [name="status"]').change(function(){
    	getReceiptData();
    })
    $('[name="week"], [name="year"]').change(function(){
        $('[name="date_from"], [name="date_to"]').val('')
        $('[name="week"]').val(('0' + $('[name="week"]').val()).slice(-2))
        getReceiptData();
    })
    $('[name="contract_date_from"], [name="contract_date_to"]').change(function(){
        $('[name="contract_week"]').val('')
        $('[name="contract_year"]').val('')
    	getContractData();
    })
    $('[name="contract_week"], [name="contract_year"]').change(function(){
        $('[name="contract_date_from"], [name="contract_date_to"]').val('')
        $('[name="contract_week"]').val(('0' + $('[name="contract_week"]').val()).slice(-2))
        getContractData();
    })    
    $('[name="contract_status"]').change(function(){
        getContractData();
    })
    getReceiptData();
    getContractData();
})

function showReceipt() {
    $('#payments_modal').modal('show');
}

function showContract() {
    $('#contract_modal').modal('show');
}

function getReceiptData() {
    var  data = {
        date_from: $('[name="date_from"]').val(),
        date_to: $('[name="date_to"]').val(),
        account_id: $('[name="account_id"]').val(),
        week: $('[name="week').val(),
        year: $('[name="year').val(),
        status: $('[name="status').val(),
        insurance_control_id: insurance_control_id,
    }
    $.post(payments_list_url, data, function (response) {
        response = JSON.parse(response);
        show_receipt(response);
    });
}

function getContractData() {
    var  data = {
        date_from: $('[name="contract_date_from"]').val(),
        date_to: $('[name="contract_date_to"]').val(),
        week: $('[name="contract_week').val(),
        year: $('[name="contract_year').val(),
        status: $('[name="contract_status').val(),
        insurance_control_id: insurance_control_id,
    }
    $.post(contract_list_url, data, function (response) {
        response = JSON.parse(response);
        show_contract(response);
    });
}

var receipt_amount = 0;
var receipt_id = "";
var contract_id = "";
var contract_amount = 0;
function show_receipt(response) {
    if ($.fn.DataTable.isDataTable("#payment_table")) {
        $('#payment_table').DataTable().clear().destroy();
      }
    var html = '';
    html = `
        <thead>
            <tr>
                <th>Fecha/Hora</th>
                <th>Semana</th>
                <th>Referencia</th>
                <th>Nombre</th>
                <th>Monto</th>
                <th>Cuenta</th>
                <th>Unidad</th>
                <th>Usuario</th>
            </tr>
        </thead>
    `; 
    html += '<tbody id="payment_table_body" class="payment_table_body">';
    for (var i = 0; i < response.length; i++) {
        html += `
            <tr onclick="set_receipt_amount(${i})" id="receipt_row_${i}">
                <td>${response[i][0]}</td>
                <td>${response[i][1]}</td>
                <td id="receipt_id${i}">${response[i][2]}</td>
                <td>${response[i][3]}</td>
                <td id="payments_amount${i}">${response[i][4]}</td>
                <td>${response[i][5]}</td>
                <td>${response[i][6]}</td>
                <td>${response[i][7]}</td>
            </tr>
        `
    }
    html += '</tbody>';
    $('#payment_table').empty();
    $('#payment_table').append(html);
    $('#payment_table').dataTable({
        select: true
    } );
}

function show_contract(response) {
    if ($.fn.DataTable.isDataTable("#client_contract")) {
        $('#client_contract').DataTable().clear().destroy();
    }
    
    var html = '';
    html += `
        <thead>
            <tr>
                <th class="all">ID</th>
                <th class="all">Fecha</th>
                <th class="all" data-orderable="false">Unidad</th>
                <th class="all">Nombre</th>
                <th class="all">Total</th>
                <th class="all">Pagado</th>
                <th class="all">P/A</th>
                <th class="all">Saldo Actual</th>
                <th class="all">Pendiente</th>
                <th class="all">Tipo</th>
                <th class="all">Documento</th>
            </tr>
        </thead>
    `;
    html += `<tbody id="client_contract_body" class="client_contract_body">`;
    for (var i = 0; i < response.length; i++) {
        html += `
            <tr onclick="set_contract_amount(${i})">
                <td id="contract_id${i}">${response[i][0]}</td>
                <td>${response[i][1]}</td>
                <td>${response[i][2]}</td>
                <td>${response[i][3]}</td>
                <td id="contract_amount_${i}">${response[i][4]}</td>
                <td>${response[i][5]}</td>
                <td>${response[i][6]}</td>
                <td>${response[i][7]}</td>
                <td>${response[i][8]}</td>
                <td>${response[i][9]}</td>
                <td>${response[i][10]}</td>
            </tr>
        `
    }
    html += `</tbody>`;
    $('#client_contract').empty();
    $('#client_contract').append(html);
    $('#client_contract').DataTable({
        select: true
    } );
}

function set_amount() {
    // $('#payment_table').dataTable().clear();
    // $('#client_contract').dataTable().fnDestroy();
    $('[name=amount]').val(-contract_amount + receipt_amount);
    $('#payments_modal').modal('hide');
}

function set_receipt_amount(index) {
    receipt_amount = parseFloat($('#payments_amount' + index).text());
    receipt_id = $('#receipt_id' + index).text();
    $('[name=receipt_id]').val(receipt_id);
    $('#payments_amount').text(receipt_amount);
}

function set_contract_amount(index) {
    contract_amount = parseFloat($('#contract_amount_' + index).text());
    contract_id = $('#contract_id' + index).text();
    console.log(contract_id);
    $('[name=contract_id]').val(contract_id);
    $('#contract_amount').text(contract_amount);
}