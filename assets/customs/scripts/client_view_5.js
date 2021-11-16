function client_contract_finance_amount_update()
{
	total_amount = $('[name="total_amount"]').val()
	interest = $('[name="interest"]').val()
	if(total_amount && interest)
	{
		$('[name="finance_amount"]').val(calculate_finance_amount(total_amount, interest));	
		client_contract_dues_count_update();	
	}
}
function client_contract_dues_count_update()
{
	dues_amount = $('[name="dues_amount"]').val()
    first_payment_amount = $('[name="first_payment_amount"]').val()
	finance_amount = $('[name="finance_amount"]').val()
	if(finance_amount && dues_amount)
	{
        if(first_payment_amount > dues_amount)
        {
            $('[name="first_payment_amount"]').val(dues_amount);
            first_payment_amount = dues_amount;
        }
		dues_count = calculate_dues_count(finance_amount - first_payment_amount, dues_amount);
		$('[name="dues_count"]').val(dues_count + 1);            		
	}	
}
function client_contract_dues_amount_update()
{
	dues_count = $('[name="dues_count"]').val()
	finance_amount = $('[name="finance_amount"]').val()
	if(finance_amount && dues_count)
	{
		dues_amount = calculate_dues_amount(finance_amount, dues_count);
		$('[name="dues_amount"]').val(dues_amount);
		$('[name="first_payment_amount"]').val(dues_amount);		
	}	
}
$(document).ready(function() {
    $('[name="total_amount"], [name="interest"]').change(function(){
        if($('[name="total_amount"]').val() < 0)
            $('[name="total_amount"]').val(0)
        if($('[name="interest"]').val() < 0)
            $('[name="interest"]').val(0)
    	client_contract_finance_amount_update()
    })
    $('[name="dues_count"]').change(function(){
        if($('[name="dues_count"]').val() < 0)
            $('[name="dues_count"]').val(0)
    	client_contract_dues_amount_update()
    })
    $('[name="dues_amount"]').change(function(){
        if($('[name="dues_amount"]').val() < 0)
            $('[name="dues_amount"]').val(0)
    	client_contract_dues_count_update()
    })
    $('[name="first_payment_amount"]').change(function(){
        if($('[name="first_payment_amount"]').val() < 0)
            $('[name="first_payment_amount"]').val(0)
    })
    $('#create_dues').click(function(){
    	dues_count = $('[name="dues_count"]').val()
    	finance_amount = $('[name="finance_amount"]').val()
    	dues_amount = $('[name="dues_amount"]').val()
    	first_payment_amount = $('[name="first_payment_amount"]').val()
    	first_payment_date = $('[name="first_payment_date"]').val()
    	client_status = $('[name="client_status"]').val()
    	client_contract_type = $('[name="client_contract_type"]').val()
    	is_admin = $('[name="is_admin"]').val()
    	weeks_frequency = $('[name="weeks_frequency"]').val()
    	taller_for_choque = $('[name="taller_for_choque"]').val()
    	plat_pending_amount = $('[name="plat_pending_amount"]').val()
    	reinvestments_amount = $('[name="reinvestments_amount"]').val()
    	total_client_car_payments = $('[name="total_client_car_payments"]').val()
    	addendum_pending_amount = $('[name="addendum_pending_amount"]').val()
        limit_financing_amount = 0;
        rate = 0.2;
        if(is_admin == true){
           rate = 0.2;
        }else {
            rate = 0.15;
        }
        limit_financing_amount = parseFloat(total_client_car_payments) * rate - (parseFloat(reinvestments_amount) + parseFloat(plat_pending_amount) + parseFloat(addendum_pending_amount?addendum_pending_amount:"0") - parseFloat(taller_for_choque));
        if(!finance_amount)
            alert_error('Monto Financiar Obligatorio','El Monto a Financiar es Obligatorio para Generar las Cuotas')
        if(!dues_amount)
            alert_error('Monto Cuotas Obligatorio','El Monto de las Cuotas es Obligatorio para Generar las Cuotas')
        if(!first_payment_amount)
            alert_error('Monto Primer Pago Obligatorio','El Monto del Primer Pago es Obligatorio para Generar las Cuotas')
        if(!first_payment_date)
            alert_error('Fecha Primer Pago Obligatoria','La Fecha del Primer Pago es Obligatoria para Generar las Cuotas')
        if(!weeks_frequency)
            alert_error('Frecuencia de Pagos Obligatoria','La Frecuencia de Pagos es Obligatoria para Generar las Cuotas')
        current_date = new Date();
        current_date.setDate(current_date.getDate() - 8);
        less_date = yyyy_mm_dd(current_date);
        current_date = new Date();
        current_date.setDate(current_date.getDate() + 8);
        future_date = yyyy_mm_dd(current_date);
        compare_date = yyyy_mm_dd(create_date(first_payment_date));
        let flag = false;
        if(future_date > compare_date && less_date < compare_date && dues_count == "1") {
            flag = true;
        }
        if(finance_amount > limit_financing_amount && client_contract_type != 'crash_workshop' && !flag) {
            alert_error('No se puede crear el contrato por que supera la capacidad de financiamiento permitida.');
            return;
        }
        if(client_status == 'Finalizando' && finance_amount > 500) {
            alert_error('No se puede crear el contrato por que supera la capacidad de financiamiento permitida.');
            return;
        }
    	// car_id = $('[name="car_id"]').val();
        // for(var i = 0; i < cars.length; i ++) {
        //     if(cars[i].car_id == car_id){
        //         car_name = cars[i].identifier;
        //     }
        // }
        // var end_date = "";
        // console.log(client_contract_type);
        // console.log(due_payments);
        // for(var i = 0; i < due_payments.length; i ++) {
        //     console.log(car_name);
        //     if(due_payments[i].name == car_name && client_contract_type == due_payments[i].type) {
        //         console.log('=======')
        //         end_date = due_payments[i].end_date;
        //     }
        // }
        // console.log(end_date);
        frequency_value = $('[name="weeks_frequency"] option:selected').data('frequency-value');
        frequency_unit = $('[name="weeks_frequency"] option:selected').data('frequency-unit');
        
    	if(finance_amount && dues_amount && first_payment_amount && first_payment_date && weeks_frequency)
    	{
    		dues = calculate_dues(parseFloat(finance_amount), parseFloat(dues_amount), parseFloat(first_payment_amount), first_payment_date, frequency_value, frequency_unit, []);
    		$('#dues_details_container table tbody tr').remove();
    		dues.forEach(function(due, due_index) {
    			date = format_date(due.date);
    			amount = due.amount;		
    			due_row = `
    					<tr>
    						<td>`+(due_index+1)+`</td>
    						<td><input type="hidden" name="due_dates[]" value="`+date+`">`+date+`</td>
    						<td><input type="hidden" name="due_amounts[]" value="`+amount+`">`+amount+`</td>
						</tr>`;
			    $('#dues_details_container table tbody').append(due_row);
			});
			$('#contract_save_container').css('display','block');
    	}
    })
    $('.get_contract_data').click(function(e){
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
            case 'credit_note':
                show_modal_credit_note_data(contract_id)
                break;  
            case 'addendum':
                show_modal_addendum_data(contract_id)
                break;          
        }
    })
    $(document).on('confirmed.bs.confirmation','.client_contract_cancel', function () {
        var client_contract_cancel_href = $(this).data('href');
        bootbox.prompt("Comentarios *", function(result) {
            if (result != '' && !(result === null)) {
                var form = document.createElement("form");
                form.setAttribute("method", 'post');
                form.setAttribute("action", client_contract_cancel_href);
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

    $(document).on('confirmed.bs.confirmation','.client_contract_retire', function () {
        var client_contract_retire_href = $(this).data('href');
        bootbox.prompt("Comentarios *", function(result) {
            if (result != '' && !(result === null)) {
                var form = document.createElement("form");
                form.setAttribute("method", 'post');
                form.setAttribute("action", client_contract_retire_href);
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

    $.getJSON(credit_note_url+'ajax_get_unpaid_dues/'+client_id, function(response){
        if(response.status)
        {
            $('#dues_credit_notes_container table tbody tr').remove();
    
            response.data.forEach(function(due){
                select_days = `<select class="form-control due_cover_days" data-payment-amount="`+due.amount+`" data-pending-amount="`+due.payment_amount+`" data-days-frequency="`+due.days_frequency+`"><option value="0">Sin Cobertura</option>`;
                for (var i = 1; i <= due.days_frequency; i++) {
                    disabled = '';
                    if((i + due.days_paid) > due.days_frequency)
                        disabled = 'disabled'
                    select_days += `<option value="`+i+`" `+disabled+`>`+i+` Dia(s)</option>`;
                }
                select_days += `</select>`;
                due_row = `
                        <tr>
                            <td><input type="hidden" name="due_ids[]" value="`+due.due_id+`">`+` (`+due.formatted_date+`)</td>
                            <td>`+due.car+`</td>
                            <td>`+due.payment_amount.toFixed(2)+`</td>
                            <td>`+select_days+`<input class="form-control due_payment_amount" type="number"  data-pending-amount="`+due.payment_amount+`" name="due_payment_amounts[]" `+(is_logged_in_admin?'':'readonly')+`></td>
                        </tr>`;
                $('#dues_credit_notes_container table tbody').append(due_row);
            });                 
        }
        else
            alert_error('Error Ajax');
    })

    $(document).on('change','.due_cover_days', function(){
        payment_amount = $(this).data('payment-amount');
        pending_amount = $(this).data('pending-amount');
        cover_days = $(this).val();
        days_frequency = $(this).data('days-frequency');
        cover_days_amount = dues_round(Math.min((cover_days/days_frequency)*payment_amount, pending_amount),2);
        $(this).parent().find('input.due_payment_amount').val(cover_days_amount);
        calculate_credit_note_total_amount();
    })
    $(document).on('change','.due_payment_amount', function(){
        payment_value = $(this).val();
        if(payment_value < 0)
            payment_value = 0
        pending_amount = $(this).data('pending-amount');
        $(this).val(dues_round(Math.min(payment_value, pending_amount),2));
        calculate_credit_note_total_amount();
    })

    $('[name="client_contract_type"]').change(function(){
        $('#same_type_contract_container').css('display','none')
        $.getJSON(client_url+'ajax_get_same_contract/'+client_id,{client_contract_type:$(this).val()}, function(response){
            if(response.status)
            {
                if(response.data)
                {
                    $('#same_type_contract_container').css('display','block')
                    $('#same_type_contract_container table tbody tr').remove();
        
                    data_row = `
                            <tr>
                                <td>`+response.data.first_payment_date+` - `+response.data.end_date+`</td>
                                <td>`+response.data.pending_dues+`</td>
                                <td>`+response.data.total_amount+`</td>
                                <td>`+response.data.dues_amount+`</td>
                                <td>`+response.data.weeks_frequency+`</td>
                                <td>`+response.data.pending_amount+`</td>
                                <td>`+response.data.current_amount+`</td>
                            </tr>`;
                    $('#same_type_contract_container table tbody').append(data_row);     
                }                            
            }
            else
                alert_error('Error Ajax');
        })
        
    })    

    $(document).on('click','.get_payment_data',function(e){
        e.preventDefault();
        show_modal_payment_data($(this).data('payment-id'))
    })
    $(document).on('click','.print_payment_receipt',function(e){
        e.preventDefault();
        print_receipt($(this).data('payment-receipt-url'))
    })

    client_payments_table = initializeDatatable('client_payment_list');

    client_payments_table.on('search.dt', function () {
        data = client_payments_table.api().rows( { filter : 'applied'} ).data();
        data_length = client_payments_table.api().rows( { filter : 'applied'} ).nodes().length;
        total_row_amount = 0;
        for(i=0; i < data_length; i++)
        {
            row = data[i]
            row_amount = parseFloat($(row[3]).data('payment-total-amount'))
            total_row_amount += row_amount;
        }
        $('#client_payments_total').text(format_number(total_row_amount));
    } );

    $(document).on('confirmed.bs.confirmation','.car_contract_cancel', function () {
        var car_contract_cancel_href = $(this).data('href');
        bootbox.prompt("Comentarios *<br> <small><span class=\"badge\">Recuerde cancelar el registro de ganancia de abono inicial relacionado a este vehículo para evitar datos duplicados</span></small>", function(result) {
            if (result != '' && !(result === null)) {
                var form = document.createElement("form");
                form.setAttribute("method", 'post');
                form.setAttribute("action", car_contract_cancel_href);
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
    $('.car_contract_filters [name="client_payment_car_id"]').change(function(){
        window.location.href = view_url+'?tab=client_payments'+($(this).val()?'&client_payment_car_id='+$(this).val():'');
    }) 
    
    $(document).on('click','.print_contract_receipt',function(e){
        var begin_date = $(this).parent().parent().children().eq(1).text();
        print_receipt($(this).data('contract-receipt-url')+'?begin_date='+begin_date)
    })

    $(".select-pdf").click(e => {
        $("[name=file]").click();
    })
    $("[name=file]").change(e => {
        try {
            file = e.target.files[0];
            $("[name=filename]").val(file.name);
            $(".select-pdf").addClass("hidden");
            $(".save-pdf").removeClass("hidden");
            $(".delete-pdf").removeClass("hidden");
        } catch (err) { }
    })
    $(".delete-pdf").click(e => {
        $("[name=filename]").val("");
        $("[name=file]").val("");
        $(".select-pdf").removeClass("hidden");
        $(".save-pdf").addClass("hidden");
        $(".delete-pdf").addClass("hidden");
    })
    $(".save-pdf").click(e => {
        var formdata = new FormData();
        formdata.append('file', $('input[name=file]')[0].files[0]);
        formdata.append("filename", $("[name=filename]").val());
        formdata.append('client_id',$('[name=client_id]').val());
        $(".delete-pdf").click();
        $.ajax({
            type: "POST",
            url: client_url + "upload_file",
            data: formdata,
            contentType: false,
            cache: false,
            processData: false,
            success:
                function (data) {
                    drawDocumentTable();
                },
            error: function (error) {
            }

        });// you have missed this bracket
    })

    drawDocumentTable();
})

function calculate_credit_note_total_amount()
{
    total_amount = 0;
    $('.due_payment_amount').each(function(){
        if($(this).val())
            total_amount += parseFloat($(this).val());
    })
    $('[name="amount"]').val(total_amount)
}

var documentData = [];

function drawDocumentTable() {
    var client_id = $('[name=client_id]').val();
    $('#client_document_list table').remove();
    $.getJSON(client_url + 'ajax_get_document/' + client_id, function (response) {
        contract_list_container = $(`
                <table class="table table-striped table-bordered table-hover dt-responsive" width="100%">
                    <thead>
                        <tr>
                            <th class="all">Título</th>
                            <th class="all">Fecha</th>
                            <th class="all">Usuario</th>
                            <th class="all">Tipo</th>
                            <th class="all">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
        `)
        var i = -1;
        documentData = response.documents;
        response.documents.forEach(function (document) {
            if(document.client_id && document.client_id == client_id){
                i++;
                contract_list_container.find('tbody').append(`
                    <tr class="document_body_${i}">
                        <td><input class="form-control input-md input-inline edt_name_${i}" type="text" value="${document.file_name}" readonly></td>
                        <td>${document.date}</td>
                        <td>${document.full_name}</td>
                        <td>${document.file_type}</td>
                        <td>
                            <a onclick="window.open('${base_path}${document.file_path}', '_blank', 'fullscreen=yes'); return false;" class="btn btn-outline btn-circle btn-sm green"><i class="fa fa-eye"></i> Ver </a>
                            <button id="edit_${i}" class="btn btn-outline btn-circle btn-sm blue" onclick="btn_edit_clicked(${i})"><i class="fa fa-edit"></i> Editar </button>
                            <button id="submit_${i}" class="btn btn-outline btn-circle btn-sm green hidden" onclick="btn_submit_clicked(${document.id}, ${i})"><i class="fa fa-save"></i> Salvar </button>

                            <button id="del_${i}" type="button" class="btn btn-outline btn-circle btn-sm red" onclick="btn_delete_clicked(${i})"><i class="fa fa-trash"></i> Eliminar </button>
                            <button id="okay_${i}" class="btn btn-outline btn-circle btn-sm green hidden" onclick="btn_okay_clicked(${document.id}, ${i})"> Okay </button>

                            <button id="cancel_${i}" type="button" class="btn btn-outline btn-circle btn-sm red hidden" onclick="btn_cancel_clicked(${i})" ><i class="fa fa-times"></i> Cancelar </button>
                    </tr>
                `)
                $('#client_document_list').append(contract_list_container);
            }
        });
    });
}

function btn_okay_clicked(id, i) {
    file_name =  $('.edt_name_' + i).val();
    data = {
        id: id, 
        file_name: file_name
    }
    $.ajax({
        type: "POST",
        url: client_url + "delete_client_document/", 
        data: data,
        cache:false,
        success: 
             function(response){
                alert('Success');
                $('.document_body_'+i).remove();
             }
         });// you have missed this bracket
}

function btn_submit_clicked(id, i) {
    file_name =  $('.edt_name_' + i).val();
    data = {
        id: id, 
        file_name: file_name
    }
    $.ajax({
        type: "POST",
        url: client_url + "update_client_document/", 
        data: data,
        cache:false,
        success: 
             function(response){
                alert('Success');
                documentData[i].file_name = file_name;
                btn_cancel_clicked(i);
             }
         });// you have missed this bracket
}

function btn_edit_clicked(i) {
    $('.edt_name_' + i).attr('readonly', false);
    $('#edit_' + i).addClass('hidden');
    $('#del_' + i).addClass('hidden');
    $('#submit_' + i).removeClass('hidden');
    $('#cancel_' + i).removeClass('hidden');
}

function btn_delete_clicked(i) {
    $('#del_' + i).addClass('hidden');
    $('#edit_' + i).addClass('hidden');
    $('#okay_' + i).removeClass('hidden');
    $('#cancel_' + i).removeClass('hidden');
}

function btn_cancel_clicked(i) {
    $('.edt_name_' + i).val(documentData[i].file_name);
    $('.edt_name_' + i).attr('readonly', true);
    
    $('#del_' + i).removeClass('hidden');
    $('#edit_' + i).removeClass('hidden');

    $('#okay_' + i).addClass('hidden');
    $('#submit_' + i).addClass('hidden');
    $('#cancel_' + i).addClass('hidden');
}