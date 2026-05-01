let currentStep = 0

function assignPage (index) {
    $('.welcome-page-section').addClass('hidden')
    $(`#welcome-page-${index}`).removeClass('hidden')
}

$('.next-button').on('click', function() {
    currentStep = currentStep + 1
    assignPage(currentStep)
});

$('.back-button').on('click', function() {
    currentStep = currentStep - 1
    console.log('currentStep', currentStep)
    assignPage(currentStep)
});

$('.skip-button').on('click', function() {
    currentStep = 4
    assignPage(currentStep)
});
