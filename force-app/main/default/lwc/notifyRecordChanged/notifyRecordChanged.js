import { LightningElement, api } from 'lwc';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';

export default class NotifyRecordChanged extends LightningElement {

    @api recordId

    connectedCallback(){
        getRecordNotifyChange([{recordId: this.recordId}])
    }
}