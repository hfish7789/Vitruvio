$(document).ready(function(){
	$(document).on('clear.bs.fileinput','.fileinput',function(){
		$('[name="delete_photo"]').val('1');
	})
})