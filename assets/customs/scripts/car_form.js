$(document).ready(function(){
	$('[name="make_id"]').change(function(){
		$('[name="model_id"] option[value!=""]').remove();					
		if($(this).val())
		{
			$.getJSON(general_url+'ajax_get_models_from_make/'+$(this).val(), function(response){
				if(response.status)
				{
					response.data.forEach(function(model){
						$('[name="model_id"]').append('<option value="'+model.model_id+'">'+model.title+'</option>')
					});
				}
				else
					alert_error('Error Ajax');
			})
		}
	})
})