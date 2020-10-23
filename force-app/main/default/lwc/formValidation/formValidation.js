/**
 * Created by bkandov on 23/10/2020.
 */

import {LightningElement, track, api} from 'lwc';
import {showError, showSuccess} from "c/toastService";

export default class FormValidation extends LightningElement {

    @track formFields = {
        name: '',
        phone: '',
        email: '',
        date: '',
        number: 0,
        toggle: false
    }

    @track isFormValid = false

    @api
    get isFormDisabled() {
        return !this.isFormValid
    }

    set isFormDisabled(value) {
        this.isFormValid = value
    }

    onFieldChange(event) {

        const {name, value, type, checked} = event.target
        console.log('name >> ', name, ',  value >> ', value, ',  type >> ', type, ',  checked >> ', checked)

        if (type === 'toggle' || type === 'checkbox') {
            this.formFields[name] = checked
        } else {
            this.formFields[name] = value
        }

        this.isFormDisabled = this.validateForm()
    }

    onFormSubmit() {

        this.isFormDisabled = this.validateForm()

        if (this.isFormValid) {
            showSuccess.call(this, 'Success', 'Form Submitted')
        } else {
            showError.call(this, 'Error', 'Please Fill Correct Data')
        }
    }

    validateForm() {

        const inputFields = this.template.querySelectorAll('lightning-input')
        const isInputsCorrect = [...inputFields].reduce((validSoFar, inputField) => {
            inputField.reportValidity();
            return validSoFar && inputField.checkValidity();
        }, true);

        return isInputsCorrect
    }

}