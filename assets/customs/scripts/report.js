$(document).ready(function() {
    $('[name="week"], [name="week_from"], [name="week_to"]').change(function(){
        $(this).val(('0' + $(this).val()).slice(-2))
    })
    $('[name="car_id"]').change(function(){
		if($(this).val())
		{
			$.getJSON(general_url+'ajax_get_active_client_from_car/'+$(this).val(), function(response){
				if(response.status)
				{
					$('[name="client_id"]').val(response.data.client_id).trigger('change')
				}
				else
					alert_error('Error Ajax');
			})		
		}		
	})
	$('#close_daily').click(function(e){
        e.preventDefault();
        $('#print_iframe').attr('src',daily_close_url+'?date_from='+encodeURI($('#daily [name="date_from"]').val())+'&date_to='+encodeURI($('#daily [name="date_to"]').val())); 
	})
	$('#short_daily').click(function(e){
        e.preventDefault();
        $('#print_iframe').attr('src',daily_short_url+'?date_from='+encodeURI($('#daily [name="date_from"]').val())+'&date_to='+encodeURI($('#daily [name="date_to"]').val())); 
    })
    $('.report_submit').click(function(){
    	prev_report();
    })
    $('.report_form').submit(function(){
    	prev_report();
    })
    $("#gain_expense_all_cars").click(function(){
	    if($("#gain_expense_all_cars").is(':checked')){
	        $("#gain_expenses_cars > option").prop("selected","selected");// Select All Options
	        $("#gain_expenses_cars").trigger("change");// Trigger change to select 2
	    }else{
	        $("#gain_expenses_cars > option").removeAttr("selected");
	        $("#gain_expenses_cars").trigger("change");// Trigger change to select 2
	     }
	});

	$('[name="week"], [name="year"]').change(function(){
		$(this).closest('.portlet').find('[name="date_from"]').val('');
		$(this).closest('.portlet').find('[name="date_to"]').val('');
	})
	$('[name="date_from"], [name="date_to"]').change(function(){
		$(this).closest('.portlet').find('[name="week"]').val('');
		$(this).closest('.portlet').find('[name="year"]').val('');
	})
});

function prev_report() {
	Cookies.remove('download_finished', { path: '/' });
	show_loading();
	setTimeout(function(){ check_download_finished(); }, 500);
}

function check_download_finished() {
	if(Cookies.get('download_finished'))
	{
		hide_loading()
	}
	else
	{
		setTimeout(function(){ check_download_finished(); }, 500);
	}
}