$(document).ready(function() {
    var debtor_list_dt_table = initializeAjaxDatatable('debtor_list', ajax_debtor_list_url,'debtor_list_filter_form',undefined,false);
    $('#debtor_list_filter_form [name="pending_week"]').change(function(){
        debtor_list_dt_table.api().ajax.reload();
    })
    var expire_list_dt_table = initializeAjaxDatatable('expire_list', ajax_expire_list_url,'expire_list_filter_form',undefined,false);
    $('#expire_list_filter_form [name="expiration_day"]').change(function(){
        expire_list_dt_table.api().ajax.reload();
    })
    var birth_date_list_dt_table = initializeAjaxDatatable('birth_date_list', ajax_birth_date_list_url,'birth_date_list_filter_form',undefined,false);
    $('#birth_date_list_filter_form [name="birth_month"]').change(function(){
        birth_date_list_dt_table.api().ajax.reload();
    })
    var new_client_list_dt_table = initializeAjaxDatatable('new_client_list', ajax_new_client_list_url,'new_client_list_filter_form',undefined,false);
    $('#new_client_list_filter_form [name="new_client_months"]').change(function(){
        new_client_list_dt_table.api().ajax.reload();
    })
    var maintenance_list_dt_table = initializeAjaxDatatable('maintenance_list', ajax_maintenance_list_url,'maintenance_list_filter_form',undefined,false);
    var end_contract_list_dt_table = initializeAjaxDatatable('end_contract_list', ajax_end_contract_list_url,'end_contract_list_filter_form',undefined,false);
    $('#end_contract_list_filter_form [name="end_contract_days"]').change(function(){
        end_contract_list_dt_table.api().ajax.reload();
    })

    var end_insurance_contract_list_dt_table = initializeAjaxDatatable('end_insurance_contract_list', ajax_end_insurance_contract_list_url,'end_insurance_contract_list_filter_form',undefined,false);
    $('#end_insurance_contract_list_filter_form [name="end_contract_days"]').change(function(){
        end_insurance_contract_list_dt_table.api().ajax.reload();
    })

    var credit_note_list_dt_table = initializeAjaxDatatable('credit_note_list', ajax_credit_note_list_url,'credit_note_list_filter_form',undefined,false);
    $('#credit_note_list_filter_form [name="credit_note_months"]').change(function(){
        credit_note_list_dt_table.api().ajax.reload();
    })

    morris_chart = new Morris.Donut({
        element: 'car_chart',
        data: cars_data,
        colors: ['#0000FF','#A52A2A','#DEB887','#7FFF00','#6495ED','#DC143C','#006400','#FF8C00','#8FBC8F','red','gray']
    });

    morris_chart.options.data.forEach(function(label, i){
        var legendlabel=$('<span style="display: inline-block;min-width:200px;margin-left:5px;">'+label.label+' ('+label.value+')</span>')
        var legendItem = $('<div class="mbox"></div>').css('background-color', morris_chart.options.colors[i % morris_chart.options.colors.length]).append(legendlabel)
        $('#legend').append($('<div class="col-md-6"></div>').append(legendItem))
    })
    /*morris_bar_chart = new Morris.Bar({
        element: 'car_retire_chart',
        data: [
            { y: 'Ene', payment: car_retire_payment_js_data[1], credit_note: car_retire_credit_note_js_data[1], credit_note_retired: car_retire_credit_note_retired_js_data[1], proyection: car_retire_proyection_js_data[1], retire_amount: car_retire_amount_js_data[1] },
            { y: 'Feb', payment: car_retire_payment_js_data[2], credit_note: car_retire_credit_note_js_data[2], credit_note_retired: car_retire_credit_note_retired_js_data[2], proyection: car_retire_proyection_js_data[2], retire_amount: car_retire_amount_js_data[2] },
            { y: 'Mar', payment: car_retire_payment_js_data[3], credit_note: car_retire_credit_note_js_data[3], credit_note_retired: car_retire_credit_note_retired_js_data[3], proyection: car_retire_proyection_js_data[3], retire_amount: car_retire_amount_js_data[3] },
            { y: 'Abr', payment: car_retire_payment_js_data[4], credit_note: car_retire_credit_note_js_data[4], credit_note_retired: car_retire_credit_note_retired_js_data[4], proyection: car_retire_proyection_js_data[4], retire_amount: car_retire_amount_js_data[4] },
            { y: 'May', payment: car_retire_payment_js_data[5], credit_note: car_retire_credit_note_js_data[5], credit_note_retired: car_retire_credit_note_retired_js_data[5], proyection: car_retire_proyection_js_data[5], retire_amount: car_retire_amount_js_data[5] },
            { y: 'Jun', payment: car_retire_payment_js_data[6], credit_note: car_retire_credit_note_js_data[6], credit_note_retired: car_retire_credit_note_retired_js_data[6], proyection: car_retire_proyection_js_data[6], retire_amount: car_retire_amount_js_data[6] },
            { y: 'Jul', payment: car_retire_payment_js_data[7], credit_note: car_retire_credit_note_js_data[7], credit_note_retired: car_retire_credit_note_retired_js_data[7], proyection: car_retire_proyection_js_data[7], retire_amount: car_retire_amount_js_data[7] },
            { y: 'Ago', payment: car_retire_payment_js_data[8], credit_note: car_retire_credit_note_js_data[8], credit_note_retired: car_retire_credit_note_retired_js_data[8], proyection: car_retire_proyection_js_data[8], retire_amount: car_retire_amount_js_data[8] },
            { y: 'Sep', payment: car_retire_payment_js_data[9], credit_note: car_retire_credit_note_js_data[9], credit_note_retired: car_retire_credit_note_retired_js_data[9], proyection: car_retire_proyection_js_data[9], retire_amount: car_retire_amount_js_data[9] },
            { y: 'Oct', payment: car_retire_payment_js_data[10], credit_note: car_retire_credit_note_js_data[10], credit_note_retired: car_retire_credit_note_retired_js_data[10], proyection: car_retire_proyection_js_data[10], retire_amount: car_retire_amount_js_data[10] },
            { y: 'Nov', payment: car_retire_payment_js_data[11], credit_note: car_retire_credit_note_js_data[11], credit_note_retired: car_retire_credit_note_retired_js_data[11], proyection: car_retire_proyection_js_data[11], retire_amount: car_retire_amount_js_data[11] },
            { y: 'Dic', payment: car_retire_payment_js_data[12], credit_note: car_retire_credit_note_js_data[12], credit_note_retired: car_retire_credit_note_retired_js_data[12], proyection: car_retire_proyection_js_data[12], retire_amount: car_retire_amount_js_data[12] }
        ],
        xkey: 'y',
        ykeys: ['payment', 'credit_note', 'credit_note_retired', 'retire_amount', 'proyection'],
        labels: ['Abonado', 'Notas de Credito', 'NC Retiradas', 'Saldo en Retirada', 'Proyeccion',],
        stacked: true,
        hideHover: true,
        xLabelMargin: 10
    }); 
    morris_bar_chart.options.labels.forEach(function(label, i){
        var legendlabel=$('<span style="display: inline-block;min-width:200px;margin-left:5px;">'+label+'</span>')
        var legendItem = $('<div class="mbox"></div>').css('background-color', morris_bar_chart.options.barColors[i]).append(legendlabel)
        $('#retire_legend').append(legendItem)
        $('#retire_legend').append('<br>')
    })*/
    CanvasJS.addColorSet("custom_color_set",
        [
         "rgb(237, 194, 64)",
         "rgb(11, 98, 164)",
         "rgb(122, 146, 163)",
         "rgb(77, 167, 77)",
         "rgb(175, 216, 248)",
                  
    ]); 
    chart = new CanvasJS.Chart("car_retire_chart",{
        colorSet: "custom_color_set",
        axisX:{
            labelFormatter: function ( e ) {
                if(e.value == 1)
                    return 'Ene';  
                if(e.value == 2)
                    return 'Feb';
                if(e.value == 3)
                    return 'Mar';
                if(e.value == 4)
                    return 'Abr';
                if(e.value == 5)
                    return 'May';
                if(e.value == 6)
                    return 'Jun';
                if(e.value == 7)
                    return 'Jul';
                if(e.value == 8)
                    return 'Ago';
                if(e.value == 9)
                    return 'Sep';
                if(e.value == 10)
                    return 'Oct';
                if(e.value == 11)
                    return 'Nov';
                if(e.value == 12)
                    return 'Dic';
                return e.value
            },
            interval: 1  
        },
        axisY:{
            maximum: maximum,
        },
        axisY2:{
            maximum: maximum,
        },
        data: [
        {
          type: "stackedColumn",
          axisYType: "secondary",
          dataPoints: [
            { x: 1, y: parseInt(car_retire_proyection_js_data[1]), label:"Proyeccion" }, 
            { x: 2, y: parseInt(car_retire_proyection_js_data[2]), label:"Proyeccion" }, 
            { x: 3, y: parseInt(car_retire_proyection_js_data[3]), label:"Proyeccion" }, 
            { x: 4, y: parseInt(car_retire_proyection_js_data[4]), label:"Proyeccion" },          
            { x: 5, y: parseInt(car_retire_proyection_js_data[5]), label:"Proyeccion" }, 
            { x: 6, y: parseInt(car_retire_proyection_js_data[6]), label:"Proyeccion" }, 
            { x: 7, y: parseInt(car_retire_proyection_js_data[7]), label:"Proyeccion" }, 
            { x: 8, y: parseInt(car_retire_proyection_js_data[8]), label:"Proyeccion" }, 
            { x: 9, y: parseInt(car_retire_proyection_js_data[9]), label:"Proyeccion" }, 
            { x: 10, y: parseInt(car_retire_proyection_js_data[10]), label:"Proyeccion" }, 
            { x: 11, y: parseInt(car_retire_proyection_js_data[11]), label:"Proyeccion" }, 
            { x: 12, y: parseInt(car_retire_proyection_js_data[12]), label:"Proyeccion" }
          ]
        },
        {
          type: "stackedColumn",
          dataPoints: [
            { x: 1, y: parseInt(car_retire_payment_js_data[1]), label:"Abonado" },  
            { x: 2, y: parseInt(car_retire_payment_js_data[2]), label:"Abonado" }, 
            { x: 3, y: parseInt(car_retire_payment_js_data[3]), label:"Abonado" },  
            { x: 4, y: parseInt(car_retire_payment_js_data[4]), label:"Abonado" },  
            { x: 5, y: parseInt(car_retire_payment_js_data[5]), label:"Abonado" },  
            { x: 6, y: parseInt(car_retire_payment_js_data[6]), label:"Abonado" },  
            { x: 7, y: parseInt(car_retire_payment_js_data[7]), label:"Abonado" },  
            { x: 8, y: parseInt(car_retire_payment_js_data[8]), label:"Abonado" },  
            { x: 9, y: parseInt(car_retire_payment_js_data[9]), label:"Abonado" },  
            { x: 10, y: parseInt(car_retire_payment_js_data[10]), label:"Abonado" },  
            { x: 11, y: parseInt(car_retire_payment_js_data[11]), label:"Abonado" }, 
            { x: 12, y: parseInt(car_retire_payment_js_data[12]), label:"Abonado" }                       
          ]
        },
        {
          type: "stackedColumn",
          dataPoints: [
            { x: 1, y: parseInt(car_retire_credit_note_js_data[1]), label:"P/A" },  
            { x: 2, y: parseInt(car_retire_credit_note_js_data[2]), label:"P/A" }, 
            { x: 3, y: parseInt(car_retire_credit_note_js_data[3]), label:"P/A" },  
            { x: 4, y: parseInt(car_retire_credit_note_js_data[4]), label:"P/A" },  
            { x: 5, y: parseInt(car_retire_credit_note_js_data[5]), label:"P/A" },  
            { x: 6, y: parseInt(car_retire_credit_note_js_data[6]), label:"P/A" },  
            { x: 7, y: parseInt(car_retire_credit_note_js_data[7]), label:"P/A" },  
            { x: 8, y: parseInt(car_retire_credit_note_js_data[8]), label:"P/A" },  
            { x: 9, y: parseInt(car_retire_credit_note_js_data[9]), label:"P/A" },  
            { x: 10, y: parseInt(car_retire_credit_note_js_data[10]), label:"P/A" },  
            { x: 11, y: parseInt(car_retire_credit_note_js_data[11]), label:"P/A" }, 
            { x: 12, y: parseInt(car_retire_credit_note_js_data[12]), label:"P/A" }                       
          ]
        },
        {
          type: "stackedColumn",
          dataPoints: [
            { x: 1, y: parseInt(car_retire_credit_note_retired_js_data[1]), label:"P/A Retirados" },  
            { x: 2, y: parseInt(car_retire_credit_note_retired_js_data[2]), label:"P/A Retirados" }, 
            { x: 3, y: parseInt(car_retire_credit_note_retired_js_data[3]), label:"P/A Retirados" },  
            { x: 4, y: parseInt(car_retire_credit_note_retired_js_data[4]), label:"P/A Retirados" },  
            { x: 5, y: parseInt(car_retire_credit_note_retired_js_data[5]), label:"P/A Retirados" },  
            { x: 6, y: parseInt(car_retire_credit_note_retired_js_data[6]), label:"P/A Retirados" },  
            { x: 7, y: parseInt(car_retire_credit_note_retired_js_data[7]), label:"P/A Retirados" },  
            { x: 8, y: parseInt(car_retire_credit_note_retired_js_data[8]), label:"P/A Retirados" },  
            { x: 9, y: parseInt(car_retire_credit_note_retired_js_data[9]), label:"P/A Retirados" },  
            { x: 10, y: parseInt(car_retire_credit_note_retired_js_data[10]), label:"P/A Retirados" },  
            { x: 11, y: parseInt(car_retire_credit_note_retired_js_data[11]), label:"P/A Retirados" }, 
            { x: 12, y: parseInt(car_retire_credit_note_retired_js_data[12]), label:"P/A Retirados" }                       
          ]
        },
        {
          type: "stackedColumn",
          dataPoints: [
            { x: 1, y: parseInt(car_retire_amount_js_data[1]), label:"Saldo en Retirada" },  
            { x: 2, y: parseInt(car_retire_amount_js_data[2]), label:"Saldo en Retirada" }, 
            { x: 3, y: parseInt(car_retire_amount_js_data[3]), label:"Saldo en Retirada" },  
            { x: 4, y: parseInt(car_retire_amount_js_data[4]), label:"Saldo en Retirada" },  
            { x: 5, y: parseInt(car_retire_amount_js_data[5]), label:"Saldo en Retirada" },  
            { x: 6, y: parseInt(car_retire_amount_js_data[6]), label:"Saldo en Retirada" },  
            { x: 7, y: parseInt(car_retire_amount_js_data[7]), label:"Saldo en Retirada" },  
            { x: 8, y: parseInt(car_retire_amount_js_data[8]), label:"Saldo en Retirada" },  
            { x: 9, y: parseInt(car_retire_amount_js_data[9]), label:"Saldo en Retirada" },  
            { x: 10, y: parseInt(car_retire_amount_js_data[10]), label:"Saldo en Retirada" },  
            { x: 11, y: parseInt(car_retire_amount_js_data[11]), label:"Saldo en Retirada" }, 
            { x: 12, y: parseInt(car_retire_amount_js_data[12]), label:"Saldo en Retirada" }                       
          ]
        }        
      ]
    });

    chart.render();

    $('#car_contract_chart_filter_form [name="car_contract_chart_year"]').change(function(){
        $('#car_contract_chart_filter_form').submit();
    })
});