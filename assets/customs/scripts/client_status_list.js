$(document).ready(function() {
    initializeDatatable('client_status_list');
    $('.client_status_delete').on('confirmed.bs.confirmation', function () {
        window.location.href = $(this).data('href');
    });
});