import { themeColors } from '../constant/theme-constant'
import chainRemoveClass from '../utils/chainRemoveClass'
import hasElement from '../utils/hasElement'

const menuModeList = ['menu-transparent', 'menu-light', 'menu-dark', 'menu-themed']
const sideNavModeList = ['side-nav-transparent', 'side-nav-light', 'side-nav-dark', 'side-nav-themed']
const stackedSideNavMiniModeList = ['stacked-side-nav-mini-light', 'stacked-side-nav-mini-dark', 'stacked-side-nav-mini-themed']
const secondaryNavModeList = ['secondary-header-transparent', 'secondary-header-light', 'secondary-header-dark', 'secondary-header-themed']


function themeConfigurator() {
    let direction = 'ltr'
    const sideNav = $('.side-nav')
    const sideNavMenu = $('.side-nav .side-nav-content .menu')
    const secondaryHeader = $('.secondary-header')
    const stackedSideNav = $('.stacked-side-nav')
    const stackedSideNavMini = $('.stacked-side-nav-mini')

    const setLogo = () => {
        const logo = $(`.logo`)
        const logoImg = $(`.logo img`)
        const isDarkMode = $('html').hasClass('dark')
        const isCollapse = sideNav.hasClass('side-nav-collapsed')
        const isThemedSideNav = sideNav.hasClass('side-nav-themed') || stackedSideNavMini.hasClass('stacked-side-nav-mini-themed')
        const logoType = function () {

            if (isCollapse || hasElement('.stacked-side-nav')) {
                return 'streamline'
            }

            return 'full'
        }()
        const logoMode = isDarkMode || isThemedSideNav ? 'dark' : 'light'

        if(isCollapse || hasElement('.stacked-side-nav')) {
            logo.removeClass('px-6')
            logo.addClass('px-4')
            
        } else {
            logo.removeClass('px-4')
            logo.addClass('px-6')
        }

        logoImg.attr('src', `img/logo/logo-${logoMode}-${logoType}.png`);
    }

    const resetSideNavMode = () => {
        chainRemoveClass('.side-nav', sideNavModeList)
        chainRemoveClass('.side-nav .side-nav-content .menu', menuModeList)
    }

    const resetSecondaryNavMode = () => {
        chainRemoveClass('.secondary-header', secondaryNavModeList)
    }

    const resetStackedSideNavMini = () => {
        chainRemoveClass('.stacked-side-nav-mini', stackedSideNavMiniModeList)
        chainRemoveClass('.stacked-side-nav-mini .menu', menuModeList)
    }

    const setDefaultNavMode = () => {
        const urlPath = location.pathname.split('/')
        const currentPath = urlPath[urlPath.length - 1].split('.')[0]

        const setSideNavMode = (mode) => {
            sideNav.addClass(`side-nav-${mode}`);
            sideNavMenu.addClass(`menu-${mode}`);
        }

        const setStackedSideNavMode = (mode) => {
            stackedSideNavMini.addClass(`stacked-side-nav-mini-${mode}`)
            $('.stacked-side-nav-mini .menu').addClass(`menu-${mode}`)
        }

        if (currentPath.includes('modern')) {
            resetSideNavMode()
            setSideNavMode('transparent')

        }

        if (currentPath.includes('classic') || currentPath.includes('stackedSide')) {
            resetSideNavMode()

            if ($('html').hasClass('dark')) {
                setSideNavMode('dark')
            }

            if ($('html').hasClass('light')) {
                setSideNavMode('light')
            }
        }

        if (hasElement(secondaryHeader)) {
            resetSecondaryNavMode()

            if ($('html').hasClass('dark')) {
                secondaryHeader.addClass('secondary-header-dark')
            }

            if ($('html').hasClass('light')) {
                secondaryHeader.addClass('secondary-header-light')
            }
        }

        if (hasElement(stackedSideNav)) {
            resetStackedSideNavMini()

            if ($('html').hasClass('dark')) {
                setStackedSideNavMode('dark')
            }

            if ($('html').hasClass('light')) {
                setStackedSideNavMode('light')
            }
        }
    }

    $(document).on('change', 'input[name="dark-mode-toggle"]', (e)=>{

        const mode = e.target.checked ? 'dark' : 'light'
        const oppositeMode = function () {
            if (mode === 'light') {
                return 'dark'
            }

            if (mode === 'dark') {
                return 'light'
            }
        }()

        $('html').removeClass(oppositeMode);
        $('html').addClass(mode);

        
        if (hasElement(sideNav) && sideNav.hasClass(`side-nav-${oppositeMode}`)) {
            setDefaultNavMode()
        }

        if (hasElement(secondaryHeader)) {
            resetSecondaryNavMode()
            secondaryHeader.addClass(`secondary-header-${mode}`)
        }

        if (hasElement(stackedSideNav)) {
            chainRemoveClass('.stacked-side-nav-content', menuModeList)
            $('.stacked-side-nav-content').addClass(`menu-${mode}`)

            if (!$('.stacked-side-nav-mini').hasClass('stacked-side-nav-mini-themed')) {
                resetStackedSideNavMini()
                $('.stacked-side-nav-mini .menu').addClass(`menu-${mode}`)
                $('.stacked-side-nav-mini').addClass(`stacked-side-nav-mini-${mode}`)
            }
        }

        setLogo()
    });

    $("#dir-ltr-button").on("click", function() {
        
        if (direction !== "ltr") {
            direction = "ltr";
            $("html").attr("dir", "ltr");
            $('#dir-ltr-button').removeClass('bg-white dark:bg-gray-700');
            $('#dir-rtl-button').removeClass('bg-gray-100 dark:bg-gray-500');
            $('#dir-ltr-button').addClass('bg-gray-100 dark:bg-gray-500');

        }
    });

    $("#dir-rtl-button").on("click", function() {
        if (direction !== "rtl") {
            direction = "rtl";
            $("html").attr("dir", "rtl");
            $('#dir-rtl-button').removeClass('bg-white dark:bg-gray-700');
            $('#dir-ltr-button').removeClass('bg-gray-100 dark:bg-gray-500');
            $('#dir-rtl-button').addClass('bg-gray-100 dark:bg-gray-500');
        }
    });

    $('#theme-select').on('change', (e)=> {
        const color = e.target.value
        let primary = themeColors[color]

        if (color === 'primary') {
            primary = themeColors['indigo']
        }

        const root = document.querySelector(':root')
        const colorLevel = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
        colorLevel.forEach((level) => {
            root.style.setProperty(`--primary-color-${level}`, primary[`${level}`]);
        })
    });
    
    const handleLayoutClick = (layout) => {
        const pathArr = window.location.pathname.split('/')
        const lastPath = pathArr[pathArr.length - 1]
        const splitedPath = lastPath.split('-')
        splitedPath[0] = layout
        location.href = splitedPath.join('-')
    }

    $('#layout-classic').on('click', ()=> {
        handleLayoutClick('classic')
    });

    $('#layout-modern').on('click', ()=> {
        handleLayoutClick('modern')
    });
    
    $('#layout-stackedSide').on('click', ()=> {
        handleLayoutClick('stackedSide')
    });
    
    $('#layout-simple').on('click', ()=> {
        handleLayoutClick('simple')
    });

    $('#layout-decked').on('click', ()=> {
        handleLayoutClick('decked')
    });

    $('input[name="nav-mode-radio-group"]').on('change', function() {
        const selectedValue = $(this).val();
        
        if (selectedValue === 'themed') {

            if (hasElement(sideNav)) {
                resetSideNavMode()

                sideNav.addClass('side-nav-themed');
                sideNavMenu.addClass('menu-themed');
            }

            if (hasElement(secondaryHeader)) {
                resetSecondaryNavMode()
                secondaryHeader.addClass('secondary-header-themed')
            }

            if (hasElement(stackedSideNav)) {
                resetStackedSideNavMini()
                $('.stacked-side-nav-mini .menu').addClass('menu-themed')
                $('.stacked-side-nav-mini').addClass('stacked-side-nav-mini-themed')
            }
        }

        if (selectedValue === 'default') {
            setDefaultNavMode()
        }

        setLogo()
    });

}

export default { themeConfigurator }