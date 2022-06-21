import { LightningElement, track } from 'lwc';

export default class HealtyView extends LightningElement {

    @track error;
    @track stack;

    constructor() {
        super();
        this.template.onerror = this.errorCallback
    }

    errorCallback(error, stack) {
        console.log('HealtyView error >> ', error)
        this.error = error;
        this.stack = stack;
    }
}