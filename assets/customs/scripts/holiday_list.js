$(document).ready(function() {
    initializeDatatable('holiday_list');
    $('.holiday_delete').on('confirmed.bs.confirmation', function () {
        window.location.href = $(this).data('href');
    });
});