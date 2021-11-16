$(document).ready(function() {
    initializeDatatable('model_list');
    $('.model_delete').on('confirmed.bs.confirmation', function () {
        window.location.href = $(this).data('href');
    });
});