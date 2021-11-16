function car_contract_dues_count_update() {
    dues_amount = $('#dues_form [name="dues_amount"]').val()
    first_payment_amount = $('#dues_form [name="first_payment_amount"]').val()
    total_amount = $('#dues_form [name="total_amount"]').val()
    if (total_amount && dues_amount) {
        if (first_payment_amount > dues_amount) {
            $('#dues_form [name="first_payment_amount"]').val(dues_amount);
            first_payment_amount = dues_amount;
        }
        dues_count = calculate_dues_count(total_amount - first_payment_amount, dues_amount);
        $('#dues_form [name="dues_count"]').val(dues_count + 1);
    }
}
function car_contract_dues_amount_update() {
    dues_count = $('#dues_form [name="dues_count"]').val()
    total_amount = $('#dues_form [name="total_amount"]').val()
    if (total_amount && dues_count) {
        dues_amount = calculate_dues_amount(total_amount, dues_count);
        $('#dues_form [name="dues_amount"]').val(dues_amount);
        $('#dues_form [name="first_payment_amount"]').val(dues_amount);
    }
}
$(document).ready(function () {
    $('#dues_form [name="dues_count"]').change(function () {
        car_contract_dues_amount_update()
    })
    $('#dues_form [name="dues_amount"]').change(function () {
        car_contract_dues_count_update()
    })
    $('#dues_form [name="car_contract_type"]').change(function () {
        if ($(this).val() == 'insurance')
            $('#dues_form #policy_container').css('display', 'block');
        else
            $('#dues_form #policy_container').css('display', 'none');
    })
    $('#create_dues').click(function () {
        total_amount = $('#dues_form [name="total_amount"]').val()
        dues_amount = $('#dues_form [name="dues_amount"]').val()
        first_payment_amount = $('#dues_form [name="first_payment_amount"]').val()
        first_payment_date = $('#dues_form [name="first_payment_date"]').val()
        weeks_frequency = $('#dues_form [name="weeks_frequency"]').val()
        if (!total_amount)
            alert_error('Monto Total Obligatorio', 'El Monto a Total es Obligatorio para Generar las Cuotas')
        if (!dues_amount)
            alert_error('Monto Cuotas Obligatorio', 'El Monto de las Cuotas es Obligatorio para Generar las Cuotas')
        if (!first_payment_amount)
            alert_error('Monto Primer Pago Obligatorio', 'El Monto del Primer Pago es Obligatorio para Generar las Cuotas')
        if (!first_payment_date)
            alert_error('Fecha Primer Pago Obligatoria', 'La Fecha del Primer Pago es Obligatoria para Generar las Cuotas')
        if (!weeks_frequency)
            alert_error('Frecuencia de Pagos Obligatoria', 'La Frecuencia de Pagos es Obligatoria para Generar las Cuotas')

        frequency_value = $('#dues_form [name="weeks_frequency"] option:selected').data('frequency-value');
        frequency_unit = $('#dues_form [name="weeks_frequency"] option:selected').data('frequency-unit');

        if (total_amount && dues_amount && first_payment_amount && first_payment_date && weeks_frequency) {
            dues = calculate_dues(parseFloat(total_amount), parseFloat(dues_amount), parseFloat(first_payment_amount), first_payment_date, frequency_value, frequency_unit, []);
            $('#dues_details_container table tbody tr').remove();
            dues.forEach(function (due, due_index) {
                date = format_date(due.date);
                amount = due.amount;
                due_row = `
    					<tr>
    						<td>`+ (due_index + 1) + `</td>
    						<td><input type="hidden" name="due_dates[]" value="`+ date + `">` + date + `</td>
    						<td><input type="hidden" name="due_amounts[]" value="`+ amount + `">` + amount + `</td>
						</tr>`;
                $('#dues_details_container table tbody').append(due_row);
            });
            $('#contract_save_container').css('display', 'block');
        }
    })

    initializeDatatable('car_contract_list');
    $('.car_contract_filters [name="car_contract_type"]').change(function () {
        window.location.href = view_url + '?tab=car_contracts' + ($(this).val() ? '&car_contract_type=' + $(this).val() : '');
    })

    $('#create_client_dues').click(function () {
        total_amount = $('#client_dues_form [name="total_amount"]').val()
        dues_amount = $('#client_dues_form [name="dues_amount"]').val()
        dues_amount_2 = $('#client_dues_form [name="dues_amount_2"]').val()
        dues_amount_3 = $('#client_dues_form [name="dues_amount_3"]').val()
        first_payment_amount = $('#client_dues_form [name="first_payment_amount"]').val()
        first_payment_date = $('#client_dues_form [name="first_payment_date"]').val()
        days_frequency = $('#client_dues_form [name="days_frequency"]').val()

        if (!total_amount)
            alert_error('Deuda Inicial Obligatorio', 'La Deuda Inicial es Obligatoria para Generar las Cuotas')
        if (!dues_amount)
            alert_error('Monto Cuotas Obligatorio', 'El Monto de las Cuotas es Obligatorio para Generar las Cuotas')
        if (!dues_amount_2)
            alert_error('Monto Cuotas 2 Obligatorio', 'El Monto de las Cuotas 2 es Obligatorio para Generar las Cuotas')
        if (!dues_amount_3)
            alert_error('Monto Cuotas 3 Obligatorio', 'El Monto de las Cuotas 3 es Obligatorio para Generar las Cuotas')
        if (!first_payment_amount)
            alert_error('Monto Primer Pago Obligatorio', 'El Monto del Primer Pago es Obligatorio para Generar las Cuotas')
        if (!first_payment_date)
            alert_error('Fecha Primer Pago Obligatoria', 'La Fecha del Primer Pago es Obligatoria para Generar las Cuotas')
        if (!days_frequency)
            alert_error('Frecuencia de Pagos Obligatoria', 'La Frecuencia de Pagos es Obligatoria para Generar las Cuotas')

        frequency_value = $('#client_dues_form [name="days_frequency"] option:selected').data('frequency-value');
        frequency_unit = $('#client_dues_form [name="days_frequency"] option:selected').data('frequency-unit');

        if (total_amount && dues_amount && dues_amount_2 && dues_amount_3 && first_payment_amount && first_payment_date && days_frequency) {
            $('#client_dues_form [name="dues_count"]').val(calculate_dues_count(parseFloat(total_amount) - parseFloat(first_payment_amount), parseFloat(dues_amount), parseFloat(dues_amount_2), parseFloat(dues_amount_3)))
            not_pay_dates = $('#client_dues_form [name="holiday_payment"]').is(':checked') ? [] : holidays_dates;
            dues = calculate_dues(total_amount, parseFloat(dues_amount), parseFloat(first_payment_amount), first_payment_date, frequency_value, frequency_unit, [...new Set([...not_pay_dates, ...client_not_pay_dates])], parseFloat(dues_amount_2), parseFloat(dues_amount_3));
            $('#client_dues_details_container table tbody tr').remove();
            dues.forEach(function (due, due_index) {
                date = format_date(due.date);
                amount = due.amount;
                due_row = `
                        <tr>
                            <td>`+ (due_index + 1) + `</td>
                            <td><input type="hidden" name="due_dates[]" value="`+ date + `">` + date + `</td>
                            <td><input type="hidden" name="due_amounts[]" value="`+ amount + `">` + amount + `</td>
                        </tr>`;
                $('#client_dues_details_container table tbody').append(due_row);
            });
            $('#client_contract_save_container').css('display', 'block');
        }
    })
    $('.get_car_client_contract_data').click(function (e) {
        e.preventDefault();
        show_modal_car_client_contract_data($(this).data('car-client-contract-id'))
    })
    $('.get_car_contract_data').click(function (e) {
        e.preventDefault();
        show_modal_car_contract_data($(this).data('car-contract-id'))
    })
    $('.get_client_data').click(function (e) {
        e.preventDefault();
        show_modal_client_data($(this).data('client-id'))
    })
    $('.get_car_contract_dues_data').click(function (e) {
        e.preventDefault();
        show_modal_car_contract_dues_data($(this).data('car-contract-id'))
    })
    $(document).on('confirmed.bs.confirmation', '.car_gain_expense_cancel', function () {
        var car_gain_expense_cancel_href = $(this).data('href');
        bootbox.prompt("Comentarios *", function (result) {
            if (result != '' && !(result === null)) {
                var form = document.createElement("form");
                form.setAttribute("method", 'post');
                form.setAttribute("action", car_gain_expense_cancel_href);
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
    $(document).on('confirmed.bs.confirmation', '.car_contract_cancel', function () {
        var car_contract_cancel_href = $(this).data('href');
        bootbox.prompt("Comentarios *<br> <small><span class=\"badge\">Recuerde cancelar el registro de ganancia de abono inicial relacionado a este vehículo para evitar datos duplicados</span></small>", function (result) {
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
    $(document).on('confirmed.bs.confirmation', '.car_contract_retire', function () {
        var car_contract_retire_href = $(this).data('href');
        bootbox.prompt("Comentarios *", function (result) {
            if (result != '' && !(result === null)) {
                var form = document.createElement("form");
                form.setAttribute("method", 'post');
                form.setAttribute("action", car_contract_retire_href);
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
    $(document).on('confirmed.bs.confirmation', '.car_client_contract_delete', function () {
        window.location.href = $(this).data('href');
    });
    $(document).on('confirmed.bs.confirmation', '.car_client_contract_retire', function () {
        var retire_contract_href = $(this).data('href');
        var quota_status = $(this).data('quota-status');

        bootbox.prompt({
            title: "Comentarios *",
            callback: function (result) {
                if (result != '' && !(result === null)) {
                    var form = document.createElement("form");
                    form.setAttribute("method", 'post');
                    form.setAttribute("action", retire_contract_href);
                    var hiddenField = document.createElement("input");
                    hiddenField.setAttribute("type", "hidden");
                    hiddenField.setAttribute("name", 'comments');
                    hiddenField.setAttribute("value", result);

                    form.appendChild(hiddenField);
                    document.body.appendChild(form);
                    if (quota_status == 'driver') {
                        bootbox.prompt({
                            title: "¿Por cuanto se valora el cupo que se le retira al cliente? *",
                            inputType: 'number',
                            callback: function (result) {
                                if (result != '' && !(result === null)) {
                                    var hiddenField = document.createElement("input");
                                    hiddenField.setAttribute("type", "hidden");
                                    hiddenField.setAttribute("name", 'quota');
                                    hiddenField.setAttribute("value", result);

                                    form.appendChild(hiddenField);
                                    document.body.appendChild(form);
                                    form.submit();
                                }
                                else if (!(result === null)) {
                                    alert_error('Monto Cupo Obligatorio');
                                }
                            }
                        });
                    }
                    else
                        form.submit();
                }
                else if (!(result === null)) {
                    alert_error('Comentarios Obligatorios');
                }
            }
        });
    });
    $(document).on('confirmed.bs.confirmation', '.car_client_contract_renew', function () {
        var renew_contract_href = $(this).data('href');
        var car_client_contract_id = $(this).data('car-client-contract-id');

        bootbox.prompt({
            title: "Comentarios *",
            callback: function (result) {
                if (result != '' && !(result === null)) {
                    var form = document.createElement("form");
                    form.setAttribute("method", 'post');
                    form.setAttribute("action", renew_contract_href);
                    var hiddenField = document.createElement("input");
                    hiddenField.setAttribute("type", "hidden");
                    hiddenField.setAttribute("name", 'comments');
                    hiddenField.setAttribute("value", result);

                    form.appendChild(hiddenField);
                    document.body.appendChild(form);
                    /*if($(this).data('quota-status') == 'driver')
                    {
                        bootbox.prompt({
                            title: "¿Por cuanto se valora el cupo que se le retira al cliente? *",
                            inputType: 'number',
                            callback: function (result) {
                                if (result != '' && !(result === null)) {
                                    var hiddenField = document.createElement("input");
                                    hiddenField.setAttribute("type", "hidden");
                                    hiddenField.setAttribute("name", 'quota');
                                    hiddenField.setAttribute("value", result);

                                    form.appendChild(hiddenField);
                                    document.body.appendChild(form);
                                    show_renew_modal(form, car_client_contract_id);
                                }
                                else if (!(result === null)) {
                                    alert_error('Monto Cupo Obligatorio');
                                }
                            }
                        }); 
                    }
                    else*/
                    show_renew_modal(form, car_client_contract_id);
                }
                else if (!(result === null)) {
                    alert_error('Comentarios Obligatorios');
                }
            }
        });
    });
    if (typeof total_gain !== 'undefined') {
        $('#total_gain').text(total_gain)
    }
    if (typeof total_expense !== 'undefined') {
        $('#total_expense').text(total_expense)
    }
    if (typeof balance !== 'undefined') {
        $('#balance').text(balance)
    }

    $('[name="client_id"]').change(function () {
        if ($(this).val()) {
            $.get(client_url + 'ajax_get_client_not_pay_dates/' + $(this).val(), function (response) {
                eval(response)
            })
            $.getJSON(client_url + 'ajax_get_initial_amount_contracts/' + $(this).val(), function (response) {
                if (response.status) {
                    $('[name="initial_amount_client_contract_id"] option.removable').remove();
                    response.data.initial_amount_contracts.forEach(function (client_contract) {
                        $('[name="initial_amount_client_contract_id"]').append('<option class="removable" value="' + client_contract.client_contract_id + '">' + client_contract.total_amount + '</option>');
                    })
                }
            })
        }

    })
    drawAddendum();
    var ch = document.getElementById('total');
    if(ch && ch.checked) {
        ch.checked = false;
        $("#form_date").addClass('hidden');
    }
    
    $(document).on('click', '.get_addendums_data', function (e) {
        e.preventDefault();
        show_modal_addendums_data($(this).data('car-client-contract-id'))
    })

    $(document).on('click', '.car_client_contract_report', function (e) {
        $('#print_iframe').attr('src', car_client_contract_report_url + $(this).data('car-client-contract-id'));
    })

    $('#addendum_form #type').change(function () {
        var new_dues_display = 'block';
        var new_readonly = true;
        var new_invoice_number_display = 'none';
        var new_check_number_display = 'none';
        if ($(this).val() == 'addendum_cash') {
            new_dues_display = 'none';
            new_readonly = false;
            new_check_number_display = 'block';
        }
        if ($(this).val() == 'addendum_workshop') {
            new_dues_display = 'none';
            new_readonly = false;
            new_invoice_number_display = 'block';
        }
        $('#dues_credit_notes_container').css('display', new_dues_display)
        $('#cover_amount').prop('readonly', new_readonly)
        $('#check_number_container').css('display', new_check_number_display)
        $('#invoice_number_container').css('display', new_invoice_number_display)
    })

    $('#gain_expense_type').change(function () {
        $('.row-gain, .row-expense').css('display', $(this).val() ? 'none' : 'block')
        $('.row-' + $(this).val()).css('display', 'block')
    })
    $(document).on('click', '.print_contract_receipt', function (e) {
         e.preventDefault();
        print_receipt($(this).data('contract-receipt-url'))
    })
    $("[name=total]").change(e => {
        var ch = document.getElementById('total');
        if(!ch.checked) {
            $("#form_date").addClass('hidden');
        }else {
            $("#form_date").removeClass('hidden');
            drawAddendum();
        }
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
        formdata.append('car_id',$('[name=car_id]').val());
        $(".delete-pdf").click();
        $.ajax({
            type: "POST",
            url: car_url + "upload_file",
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
    $("[name=type]").on('change', function() {
        if(this.value == "contract_extension") {
            $('.fecha').removeClass('hidden');
            $('#form_date').removeClass('hidden');
        }else {
            $('.fecha').addClass('hidden');
            $('#form_date').addClass('hidden');
        }
    })
    drawDocumentTable();
});

function drawAddendum() {
    if (client_id) {
        $.getJSON(credit_note_url + 'ajax_get_unpaid_dues/' + client_id, function (response) {
            if (response.status) {
                $('#dues_credit_notes_container table tbody tr').remove();

                response.data.forEach(function (due, due_index) {
                    select_days = `<select class="form-control due_cover_days" data-payment-amount="` + due.amount + `" data-pending-amount="` + due.payment_amount + `" data-days-frequency="` + due.days_frequency + `"><option value="0">Sin Cobertura</option>`;
                    for (var i = 1; i <= due.days_frequency; i++) {
                        disabled = '';
                        if ((i + due.days_paid) > due.days_frequency)
                            disabled = 'disabled'
                        select_days += `<option value="` + i + `" ` + disabled + `>` + i + ` Dia(s)</option>`;
                    }
                    select_days += `</select>`;
                    let value = 0;
                    if (typeof due_payment_amounts !== 'undefined'){
                        value = due_payment_amounts[due_index]?due_payment_amounts[due_index]:0;
                    }
                    var ch = document.getElementById('total');
                    if(ch.checked) {
                        var date = new Date();
                        var currentDate = yyyy_mm_dd(date);
                        var formatted_date = (yyyy_mm_dd(create_date(due.formatted_date)));
                        if(currentDate >= formatted_date){
                            value = due.payment_amount;
                        }
                    }
                    due_row = `
                            <tr>
                                <td><input type="hidden" name="due_ids[]" value="`+ due.due_id + `">` + ` (` + due.formatted_date + `)</td>
                                <td>`+ due.car + `</td>
                                <td>`+ due.payment_amount.toFixed(2) + `</td>
                                <td>`+ select_days + `<input class="form-control due_payment_amount" value="` + value + `" data-pending-amount="` + due.payment_amount + `" type="number" name="due_payment_amounts[]"  ` + (is_logged_in_admin ? '' : 'readonly') + `></td>
                            </tr>`;
                    $('#dues_credit_notes_container table tbody').append(due_row);
                });
                calculate_credit_note_total_amount();
            }
            else
                alert_error('Error Ajax');
        })

        $(document).on('change', '.due_cover_days', function () {
            payment_amount = $(this).data('payment-amount');
            pending_amount = $(this).data('pending-amount');
            cover_days = $(this).val();
            days_frequency = $(this).data('days-frequency');
            cover_days_amount = dues_round(Math.min((cover_days / days_frequency) * payment_amount, pending_amount), 2);
            $(this).parent().find('input.due_payment_amount').val(cover_days_amount);
            calculate_credit_note_total_amount();
        })
        $(document).on('change', '.due_payment_amount', function () {
            payment_value = $(this).val();
            if (payment_value < 0)
                payment_value = 0
            pending_amount = $(this).data('pending-amount');
            $(this).val(dues_round(Math.min(payment_value, pending_amount), 2));
            calculate_credit_note_total_amount();
        })

        $('#addendum_form [name="dues_count"]').change(function () {
            addendum_contract_dues_amount_update()
        })
        $('#addendum_form [name="dues_amount"]').change(function () {
            addendum_contract_dues_count_update()
        })
        $('#addendum_form [name="additional_amount"]').change(function () {
            calculate_addendum_total_amount()
        })
        $('#addendum_form #create_addendum_dues').click(function () {
            total_amount = $('#addendum_form [name="amount"]').val()
            dues_amount = $('#addendum_form [name="dues_amount"]').val()
            first_payment_amount = $('#addendum_form [name="first_payment_amount"]').val()
            first_payment_date = $('#addendum_form [name="first_payment_date"]').val()
            weeks_frequency = $('#addendum_form [name="weeks_frequency"]').val()
            // weeks_frequency = "1 Semana"
            $('#addendum_form [name="total"]').val('0')
            if ($('#addendum_form [name="total"]').is(':checked')) {
                $('#addendum_form [name="total"]').val('1')
            }
            if (!total_amount)
                alert_error('Monto Total Obligatorio', 'El Monto a Total es Obligatorio para Generar las Cuotas')
            if (!dues_amount)
                alert_error('Monto Cuotas Obligatorio', 'El Monto de las Cuotas es Obligatorio para Generar las Cuotas')
            if (!first_payment_amount)
                alert_error('Monto Primer Pago Obligatorio', 'El Monto del Primer Pago es Obligatorio para Generar las Cuotas')
            if (!first_payment_date)
                alert_error('Fecha Primer Pago Obligatoria', 'La Fecha del Primer Pago es Obligatoria para Generar las Cuotas')
            if (!weeks_frequency)
                alert_error('Frecuencia de Pagos Obligatoria', 'La Frecuencia de Pagos es Obligatoria para Generar las Cuotas')

            frequency_value = $('#addendum_form [name="weeks_frequency"] option:selected').data('frequency-value');
            // frequency_value = 1
            frequency_unit = $('#addendum_form [name="weeks_frequency"] option:selected').data('frequency-unit');
            // frequency_unit = "week"
            if (total_amount && dues_amount && first_payment_amount && first_payment_date && weeks_frequency) {
                dues = calculate_dues(parseFloat(total_amount), parseFloat(dues_amount), parseFloat(first_payment_amount), first_payment_date, frequency_value, frequency_unit, []);
                $('#addendum_dues_details_container table tbody tr').remove();
                dues.forEach(function (due, due_index) {
                    date = format_date(due.date);
                    amount = due.amount;
                    due_row = `
                            <tr>
                                <td>`+ (due_index + 1) + `</td>
                                <td><input type="hidden" name="due_dates[]" value="`+ date + `">` + date + `</td>
                                <td><input type="hidden" name="due_amounts[]" value="`+ amount + `">` + amount + `</td>
                            </tr>`;
                    $('#addendum_dues_details_container table tbody').append(due_row);
                });
                $('#addenum_contract_save_container').css('display', 'block');
            }
        })
    }
}

function calculate_credit_note_total_amount() {
    total_amount = 0;
    $('.due_payment_amount').each(function () {
        if ($(this).val())
            total_amount += parseFloat($(this).val());
    })
    $('[name="cover_amount"]').val(dues_round(total_amount, 2))
    calculate_addendum_total_amount();
}
function addendum_contract_dues_count_update() {
    dues_amount = $('#addendum_form [name="dues_amount"]').val()
    first_payment_amount = $('#addendum_form [name="first_payment_amount"]').val()
    total_amount = $('#addendum_form [name="amount"]').val()
    if (total_amount && dues_amount) {
        if (first_payment_amount > dues_amount) {
            $('#addendum_form [name="first_payment_amount"]').val(dues_amount);
            first_payment_amount = dues_amount;
        }
        dues_count = calculate_dues_count(total_amount - first_payment_amount, dues_amount);
        $('#addendum_form [name="dues_count"]').val(dues_count + 1);
    }
}
function addendum_contract_dues_amount_update() {
    dues_count = $('#addendum_form [name="dues_count"]').val()
    total_amount = $('#addendum_form [name="amount"]').val()
    if (total_amount && dues_count) {
        dues_amount = calculate_dues_amount(total_amount, dues_count);
        $('#addendum_form [name="dues_amount"]').val(dues_amount);
        $('#addendum_form [name="first_payment_amount"]').val(dues_amount);
    }
}
function calculate_addendum_total_amount() {
    credit_note_total_amount = $('[name="cover_amount"]').val() ? parseFloat($('[name="cover_amount"]').val()) : 0;
    additional_amount = $('[name="additional_amount"]').val() ? parseFloat($('[name="additional_amount"]').val()) : 0;
    $('[name="amount"]').val((credit_note_total_amount + additional_amount).toFixed(2));
}

function show_renew_modal(form, car_client_contract_id) {
    $.getJSON(car_url + 'ajax_get_contracts_to_retire/' + car_client_contract_id, function (response) {
        if (response.status) {
            $('#modal_data .modal-body').html('');
            $('#modal_data .modal_to_remove').remove();

            left_data_container = $('<div class="col-md-12"></div>');

            modal_title = 'Contratos a Retirar';
            $('#modal_data .modal-title').html(modal_title);
            contract_list_container = $(`
                <table class="table table-striped table-bordered table-hover dt-responsive">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Tipo</th>
                            <th>Monto</th>
                            <th>Pagado</th>
                            <th>Cuotas</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            `);

            response.pending_client_contracts.forEach(function (client_contract) {
                contract_list_container.find('tbody').append(`
                    <tr>
                        <td>
                            <label class="mt-checkbox">
                                <input type="checkbox" value="`+ client_contract.client_contract_id + `" name="client_contract[]">
                                <span></span>
                            </label>
                        </td>
                        <td>`+ client_contract.client_contract_type + `</td>
                        <td>`+ client_contract.total_amount + `</td>
                        <td>`+ parseFloat(client_contract.amount_paid).toFixed(2) + `</td>
                        <td>`+ client_contract.dues_amount + `</td>
                    </tr>
                `)
            })
            response.pending_car_contracts.forEach(function (car_contract) {
                if (car_contract.car_contract_type != 'insurance') {
                    contract_list_container.find('tbody').append(`
                        <tr>
                            <td>
                                <label class="mt-checkbox">
                                    <input type="checkbox" value="`+ car_contract.car_contract_id + `" name="car_contract[]">
                                    <span></span>
                                </label>
                            </td>
                            <td>`+ car_contract.car_contract_type_label + `</td>
                            <td>`+ car_contract.total_amount + `</td>
                            <td>`+ parseFloat(car_contract.amount_paid).toFixed(2) + `</td>
                            <td>`+ car_contract.dues_amount + `</td>
                        </tr>
                    `)
                }

            })
            response.pending_addendums.forEach(function (addendum) {
                contract_list_container.find('tbody').append(`
                    <tr>
                        <td>
                            <label class="mt-checkbox">
                                <input type="checkbox" value="`+ addendum.addendum_id + `" name="addendum[]">
                                <span></span>
                            </label>
                        </td>
                        <td>Adenda</td>
                        <td>`+ addendum.amount + `</td>
                        <td>`+ (addendum.amount - addendum.pending_amount).toFixed(2) + `</td>
                        <td>`+ addendum.dues_amount + `</td>
                    </tr>
                `)
            })

            response.pending_credit_notes.forEach(function (credit_note) {
                contract_list_container.find('tbody').append(`
                    <tr>
                        <td>
                            <label class="mt-checkbox">
                                <input type="checkbox" value="`+ credit_note.credit_note_id + `" name="credit_note[]">
                                <span></span>
                            </label>
                        </td>
                        <td>Prestamo</td>
                        <td>`+ credit_note.amount + `</td>
                        <td>`+ (credit_note.amount - credit_note.pending_amount).toFixed(2) + `</td>
                        <td>0</td>
                    </tr>
                `)
            })
            left_data_container.append(contract_list_container);
            left_data_container.append(`
                <div class="row">
                    <div class="col-md-12">
                        <button type="submit" class="btn green submit-loading-button" data-submit-text="Renovando">Renovar</button>
                    </div>
                </div>
            `)

            $('#modal_data .modal-body').append($(form).append($('<div class="row"></div>').append(left_data_container)));

            $('#modal_data').modal();
        }
        else
            alert_error('Error Ajax');
    })
    //form.submit();
}

var documentData = [];

function drawDocumentTable() {
    var car_id = $('[name=car_id]').val();
    $('#car_document_list table').remove();
    $.getJSON(car_url + 'ajax_get_document/' + car_id, function (response) {
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
            // console.log(1111,document)
            if(document.car_id && document.car_id == car_id){
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
                $('#car_document_list').append(contract_list_container);
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
        url: car_url + "delete_car_document/", 
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
        url: car_url + "update_car_document/", 
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