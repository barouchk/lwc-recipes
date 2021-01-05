/**
 * Created by bkandov on 05/01/2021.
 */

import {LightningElement, api, track} from 'lwc';

export default class CustomCheckbox extends LightningElement {

    // name is required parameter for radio-group
    @api name = 'name'

    // label of component
    @api label

    @track options = []

    @api value = ''

    @api placeholder = ''

    // option values divided by ';'
    @api stringOptions = ''

    // selected valued divided by ';'
    @api strSelectedValues = ''

    // type of component default checkbox (options:checkbox/radio/button/dropdown)
    @api type = 'checkbox'

    get isCheckbox() {
        return this.type === 'checkbox'
    }

    get isRadio() {
        return this.type === 'radio' || this.type === 'button'
    }

    get isDropdown() {
        return this.type === 'dropdown'
    }

    connectedCallback() {

        if (this.stringOptions) {
            const optionList = this.stringOptions.split(';')

            for (let option of optionList) {
                this.options.push({label: option, value: option})
            }
        }
    }

    handleChange(event) {
        const {value} = event.detail
        this.value = value;
        this.strSelectedValues = this.isCheckbox ? value.join(';') : value
    }

}