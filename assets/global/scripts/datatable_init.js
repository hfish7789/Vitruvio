function initializeDatatable(table_id, page_length){        
    var table = $('#'+table_id);
    page_length = (typeof page_length !== 'undefined') ?  page_length : 10;
    buttons = [];
    order = [];
    var oTable = table.dataTable({
        "language": {
           url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Spanish.json'
        },

        buttons: buttons,

        // setup responsive extension: http://datatables.net/extensions/responsive/
        responsive: {
            details: {
               
            }
        },

        "order": order,
        
        "lengthMenu": [
            [5, 10, 15, 20, -1],
            [5, 10, 15, 20, "Todos"] // change per page values here
        ],
        // set the initial value
        "pageLength": page_length,

        "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable

        // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
        // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
        // So when dropdowns used the scrollable div should be removed. 
        //"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
    });
    return oTable;
}

function initializeAjaxDatatable(table_id, ajax_list_url, form_id, draw_callback, info){        
    var table = $('#'+table_id);

    buttons = [];
    order = [];
    var oTable = table.dataTable({
        "processing": true, 
        "serverSide": true,
 
        "ajax": {
            "url": ajax_list_url,
            "type": "POST",
            "data": form_id === undefined?{}: function(d) {
                var formData = $("#"+form_id).serializeArray();
                var filterFormData = {}; // string -> list<string> map for filter form
         
                // Generating multimap to serialize in traditional way
                for (var i in formData) {
                    var field = formData[i];
                    var existing = filterFormData[field["name"]];
                    if (existing) {
                        existing.push(field["value"]);
                        filterFormData[field["name"]] = existing;
                    } else {
                        filterFormData[field["name"]] = [field["value"]];
                    }
                }
                // Adding filter form data, serialized in traditional way, to Datatables data, serialized in non-traditional way
                return $.param(d) + "&" + $.param(filterFormData, true);                
            }
        },
        "language": {
           url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Spanish.json'
        },

        buttons: buttons,

        // setup responsive extension: http://datatables.net/extensions/responsive/
        responsive: {
            details: {
               
            }
        },

        "order": order,
        
        "lengthMenu": [
            [5, 10, 15, 20, -1],
            [5, 10, 15, 20, "Todos"] // change per page values here
        ],
        // set the initial value
        "pageLength": 10,

        "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'"+(!(info === undefined) && !info?"":"<'col-md-5 col-sm-12'i>")+"<'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable
        "drawCallback": function( settings ) {
            App.init();
            if(!(draw_callback === undefined))
                draw_callback(settings);
        }
        // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
        // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
        // So when dropdowns used the scrollable div should be removed. 
        //"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
    });
    return oTable;
}