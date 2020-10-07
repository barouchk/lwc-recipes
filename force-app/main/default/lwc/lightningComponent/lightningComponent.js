import {LightningElement, track} from 'lwc';
import {showToast} from 'c/toastService'

export class LightningComponent extends LightningElement {

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

    loadLabel(label) {
        this.labels.push(label)
    }

    loadLabels(labels) {
        for (const label of labels) {
            this.loadLabel(label)
        }
    }

    labels = {}
}