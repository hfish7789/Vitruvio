$(document).ready(function() {
    initializeDatatable('account_list');
    $('.account_delete').on('confirmed.bs.confirmation', function () {
        window.location.href = $(this).data('href');
    });
});