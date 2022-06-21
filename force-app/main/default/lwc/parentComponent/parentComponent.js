/**
 * Created by bkandov on 11/02/2021.
 */

import {LightningElement, track, api} from 'lwc';

export default class ParentComponent extends LightningElement {

    @api recordId

    @track fields = {
        phone: ''
    }

    @track phone = ''

    handleClick() {
        console.log('parent handleClick fired')
        // this.phone = 123
        // console.log('handleClick >> ',this.phone)

        // const allValid = [...this.template.querySelectorAll('lightning-input')]
        //     .reduce((validSoFar, inputCmp) => {
        //         inputCmp.reportValidity();
        //         return validSoFar && inputCmp.checkValidity();
        //     }, true);
    }

    handleError(err) {
        // call toast event
    }

    handleButtonClicked(event) {
    }

}