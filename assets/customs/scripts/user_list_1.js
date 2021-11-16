$(document).ready(function() {
    initializeDatatable('user_list');
    $('.user_delete').on('confirmed.bs.confirmation', function () {
        window.location.href = $(this).data('href');
    });
    $('[name="status"]').change(function(){
    	$('#user_list_filter_form').submit();
    })
    $('.ip_delete').on('confirmed.bs.confirmation', function () {
        window.location.href = $(this).data('href');
    });
});