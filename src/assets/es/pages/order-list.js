$('#order-list-table').DataTable();

$('.order-checkbox').on('click', function() {
    updateSelectAllCheckbox();
});

$('#indeterminate-checkbox').on('click', function() {
    console.log('aaa')
    const isChecked = $(this).prop('checked');
    $('.order-checkbox').prop('checked', isChecked);
    updateSelectAllCheckbox()
});

function updateSelectAllCheckbox() {
    const totalItems = $('.order-checkbox').length;
    const checkedItems = $('.order-checkbox:checked').length;

    if (checkedItems === 0) {
        $('#indeterminate-checkbox').prop('checked', false);
        $('#indeterminate-checkbox').prop('indeterminate', false);
    } else if (checkedItems === totalItems) {
        $('#indeterminate-checkbox').prop('checked', true);
        $('#indeterminate-checkbox').prop('indeterminate', false);
    } else {
        $('#indeterminate-checkbox').prop('indeterminate', true);
    }
}