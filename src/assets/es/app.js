import Core from './core';
import ThemeConfigurator from './theme-configurator'
import Doc from './docs'

export default class Elstar extends Core {

    constructor () {
        super()
        this.initThemeConfig()
        this.initDoc()
    }

    initThemeConfig() {
        ThemeConfigurator.themeConfigurator()
    }

    initDoc() {
        Doc.docInit()
    }
}

$(() => {
   window.Elstar = new Elstar();
});
