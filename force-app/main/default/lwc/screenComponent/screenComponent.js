import { api, LightningElement, track, wire } from 'lwc';
import { getRecord, getFieldValue, getRecordNotifyChange } from 'lightning/uiRecordApi';

import UPDATE_FIELD from '@salesforce/schema/Opportunity.Update_Field__c';

export default class ScreenComponent extends LightningElement {

    @api recordId

    @track updateFieldView;

    connectedCallback(){
        console.log('connectedCallback runs >> ');
        // getRecordNotifyChange([{recordId: this.recordId}])
    }
    
    @wire(getRecord, { recordId: '$recordId', fields: [ UPDATE_FIELD ] })
    oppRecord({ data, error }) {
        if ( data ) {

            console.log('getRecord runs >> ');

            this.updateFieldView = getFieldValue(data, UPDATE_FIELD)

        } else if( error ){
            console.log('error >> ', error)
        }
    }

}