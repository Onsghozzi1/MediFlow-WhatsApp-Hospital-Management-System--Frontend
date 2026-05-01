import Affix from './Affix';
import Avatar from './Avatar';
import Alert from './Alert';
import DatePicker from './DatePicker'
import Tooltip from './Tooltip'
import Popover from './Popover'
import Toast from './Toast'

export default class Components {

    constructor() {
		this.initComponents()
	}

    initComponents () {
        Affix()
        Avatar()
        Alert()
        DatePicker()
        Tooltip()
        Popover()
        Toast()
    }
}