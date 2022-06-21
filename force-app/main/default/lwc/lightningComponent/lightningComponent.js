import {LightningElement, track, api} from 'lwc';

import {showToast} from 'c/toastService'

export class LightningComponent extends LightningElement {

    @api recordId

    @track state = {
        isLoading: false
    }

    setState(obj) {
        Object.getOwnPropertyNames(obj).forEach(
            fieldName => {
                this.state[fieldName] = obj[fieldName]
            }
        )
    }

    handleError(message) {
        showToast.call(this, 'title', message, 'error', 'sticky')
    }

    setLabels(obj) {
        Object.getOwnPropertyNames(obj).forEach(
            fieldName => {
                this.labels[fieldName] = obj[fieldName]
            }
        )
    }

    labels = {}
}