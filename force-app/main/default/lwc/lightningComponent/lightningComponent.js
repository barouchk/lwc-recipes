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

    setLabel(label) {
        this.labels.push(label)
    }

    labels = {}
}