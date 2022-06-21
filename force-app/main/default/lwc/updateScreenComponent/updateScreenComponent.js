import { api, LightningElement } from 'lwc';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';

export default class UpdateScreenComponent extends LightningElement {

    @api recordId

    connectedCallback(){
        getRecordNotifyChange([{recordId: this.recordId}])
    }
}