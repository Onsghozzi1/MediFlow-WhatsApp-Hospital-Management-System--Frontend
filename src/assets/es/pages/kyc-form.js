const navMapping = [
    {
        navItem: 'menu-item-0',
        section: 'personal-information-section',
        nextButton: 'personal-information-next',
        backButton: ''
    },
    {
        navItem: 'menu-item-1',
        section: 'identification-section',
        nextButton: 'identification-section-next',
        backButton: 'identification-section-back'
    },
    {
        navItem: 'menu-item-2',
        section: 'address-section',
        nextButton: 'address-section-next',
        backButton: 'address-section-back'
    },
    {
        navItem: 'menu-item-3',
        section: 'financial-section',
        nextButton: '',
        backButton: 'financial-section-back'
    }
]

function activeItem(item) {
    $('.content-section').addClass('hidden')
    $(`#${item.section}`).removeClass('hidden')
    $('.menu-item').removeClass('menu-item-active')
    $(`#${item.navItem}`).addClass('menu-item-active')
}

navMapping.forEach((item, index) => {

    $(`#${item.navItem}`).on('click', function() {
        activeItem(item)
    });

    if (item.nextButton) {
        $(`#${item.nextButton}`).on('click', function() {
            activeItem(navMapping[index + 1])
        })
    }

    if (item.backButton) {
        $(`#${item.backButton}`).on('click', function() {
            activeItem(navMapping[index - 1])
        })
    }
})

$(`#on-complete`).on('click', function() {
    $('#form-section').addClass('hidden')
    $('#complete-section').removeClass('hidden')
    $('#complete-section').addClass('flex')
});