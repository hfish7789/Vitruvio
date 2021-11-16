$(document).ready(function() {
    initializeDatatable('make_list');
    $('.make_delete').on('confirmed.bs.confirmation', function () {
        window.location.href = $(this).data('href');
    });
});