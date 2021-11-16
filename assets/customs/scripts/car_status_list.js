$(document).ready(function() {
    initializeDatatable('car_status_list');
    $('.car_status_delete').on('confirmed.bs.confirmation', function () {
        window.location.href = $(this).data('href');
    });
});