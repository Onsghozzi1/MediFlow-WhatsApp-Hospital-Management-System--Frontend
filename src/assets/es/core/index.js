import Components from './components'
import hasElement from '../utils/hasElement'

let sideNavScrollbar

const setStackedNavItemActive = (id) => {

	const resetStackedNavMenu = () => {
		$('[data-stacked-side-nav]').removeClass('block')
		$('[data-stacked-side-nav]').addClass('hidden')
	}

	$('.stacked-side-nav-menu-item').removeClass('menu-item-active')
	$(`#${id}`).addClass('menu-item-active')

	resetStackedNavMenu()
	$(`[data-stacked-side-nav="${id}"]`).removeClass('hidden')
	$(`[data-stacked-side-nav="${id}"]`).addClass('block')
}

export default class Core extends Components {

    constructor() {
		super()
		this.sideNavToggle();
		this.menuToggle();
		this.initSideNavScrollbar();
		this.initNotificationScrollbar()
		this.initMenuActive()
	}
	
    sideNavToggle() {
		const sideNav = $('.side-nav')
		let self = this
		$('#side-nav-toggle').on('click', function () {
			
            $('.side-nav-toggle-icon-expand, .side-nav-toggle-icon-collapsed').toggleClass('hidden');
			const setLogo = () => {
				const logo = $(`.side-nav .logo`)
				const logoImg = $(`.side-nav .logo img`)
				const isDarkMode = $('html').hasClass('dark')
				const isCollapse = sideNav.hasClass('side-nav-collapsed')
				const isThemedSideNav = sideNav.hasClass('side-nav-themed')
				const logoType = isCollapse ? 'streamline' : 'full'
				const logoMode = isDarkMode || isThemedSideNav ? 'dark' : 'light'

				if(sideNav.hasClass('side-nav-collapsed')) {
					logo.removeClass('px-6')
					logo.addClass('px-4')
				} else {
					logo.removeClass('px-4')
					logo.addClass('px-6')
				}
				logoImg.attr('src', `img/logo/logo-${logoMode}-${logoType}.png`);
			}
			if (sideNav.hasClass('side-nav-expand')) {
				sideNav.removeClass('side-nav-expand')
				sideNav.addClass('side-nav-collapsed')
				$('.side-nav .menu-collapse > ul').removeAttr('style')
				setLogo()
			} else if (sideNav.hasClass('side-nav-collapsed')) {
				sideNav.addClass('side-nav-expand')
				sideNav.removeClass('side-nav-collapsed')
				setLogo()
			}

			if ($('.side-nav').hasClass('side-nav-collapsed')) {
				sideNavScrollbar.destroy()
			}

			if ($('.side-nav').hasClass('side-nav-expand')) {
				self.initSideNavScrollbar()
			}
        });
	}

	menuToggle() {

		function handleMenuToggle (self) {
			$(self).parent('.menu-collapse').toggleClass('menu-collapse-item-active')
			$(self).parent('.menu-collapse').find('ul').slideToggle(100);
		}

		$('.side-nav-expand .menu-collapse > .menu-collapse-item').on('click', function() {
			if ($('.side-nav').hasClass('side-nav-expand')) {
				handleMenuToggle(this)
			}
		});

		$('.side-nav-mobile .menu-collapse > .menu-collapse-item').on('click', function() {
			handleMenuToggle(this)
		})

		if (hasElement('.stacked-side-nav')) {

			$('.stacked-side-nav-menu-item').on('click', function() {
				setStackedNavItemActive(this.id)

				if (hasElement(`[data-stacked-side-nav="${this.id}"]`)) {
					$('.stacked-side-nav-secondary').removeClass('stacked-side-nav-collapsed')
				}
			})

			$('.stacked-side-nav-content .menu-collapse > .menu-collapse-item').on('click', function() {
				handleMenuToggle(this)
			})

			$('.stacked-side-nav-collapse-button').on('click', function() {
				$('.stacked-side-nav-secondary').addClass('stacked-side-nav-collapsed')
				$('.stacked-side-nav-menu-item').removeClass('menu-item-active')
			})
		}
	}

	initMenuActive() {

		function handleMenuActive (menuItem) {
			menuItem.addClass('menu-item-active')
			if (menuItem.parent().parent('.menu-collapse').hasClass('menu-collapse')) {
				menuItem.parent().parent('.menu-collapse').toggleClass('menu-collapse-item-active')
				menuItem.parent().slideToggle(100);
			}
		}

		const urlPath = location.pathname.split('/')
		const currentPath = urlPath[urlPath.length - 1].split('.')[0]
		const navMenuItem = [
			$(`.stacked-side-nav-content [data-menu-item="${currentPath}"]`),
			$(`.side-nav-expand [data-menu-item="${currentPath}"]`),
			$(`.side-nav-mobile [data-menu-item="${currentPath}"]`)
		]

		for (let i = 0; i < navMenuItem.length; i++) {
			handleMenuActive(navMenuItem[i])
		}

		if (hasElement('.stacked-side-nav')) {
			
			$('[data-stacked-side-nav]').each(function() {
				const viewAttribute = $(this).data('stacked-side-nav')

				if ($(this).find('.menu-item.menu-item-active').length === 1) {
					setStackedNavItemActive(viewAttribute)
				}
			})
		}
	}

	initSideNavScrollbar() {
		if(hasElement('.side-nav') || hasElement('.stacked-side-nav')) {
			sideNavScrollbar = new PerfectScrollbar('.side-nav-scroll');
		}
	}

	initNotificationScrollbar() {
		if(hasElement('.notification-scroll')) {
			new PerfectScrollbar('.notification-scroll');
		}
	}
}    