new PerfectScrollbar('.mail-nav-scroll')
new PerfectScrollbar('.mail-list-scroll')
new PerfectScrollbar('.mail-list-mobile-scroll')
new PerfectScrollbar('.mail-content-scroll')

$('#mail-nav-toggle').on('click', function () {
    const mailNav = $('#mail-nav')
    const mailList = $('#mail-list')
    if (mailNav.hasClass('ltr:left-0 rtl:right-0')) {
        mailNav.removeClass('ltr:left-0 rtl:right-0')
        mailNav.addClass('ltr:left-[-280px] rtl:right-[-280px]')
        mailList.removeClass('ltr:xl:ml-[280px] rtl:xl:mr-[280px]')
        return
    }

    if (mailNav.hasClass('ltr:left-[-280px] rtl:right-[-280px]')) {
        mailNav.removeClass('ltr:left-[-280px] rtl:right-[-280px]')
        mailNav.addClass('ltr:left-0 rtl:right-0')
        mailList.addClass('ltr:xl:ml-[280px] rtl:xl:mr-[280px]')
        return
    }
})


$('#back-btn').on('click', function () {
    $('#mail-content-section').addClass('hidden')
    $('#mail-content-section').removeClass('block')

    $('#mail-list').removeClass('hidden')
})

$('.mail-item').on('click', function () {
    $('#mail-content-section').removeClass('hidden')
    $('#mail-content-section').addClass('block')

    $('#mail-list').addClass('hidden')
})