/**
 * Created by bkandov on 26/11/2020.
 */

import {LightningElement, track, api} from 'lwc';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity'
import Amount from '@salesforce/schema/Opportunity.Amount'
import FIRST_PICKLIST_FIELD from '@salesforce/schema/Opportunity.First_PickList__c'
import SECOND_PICKLIST_FIELD from '@salesforce/schema/Opportunity.Second_PickList__c'

export default class RecordFormOnLoad extends LightningElement {

    @api recordId

    objectApiName = OPPORTUNITY_OBJECT.objectApiName

    @track fields = [
        Amount,
        FIRST_PICKLIST_FIELD,
        SECOND_PICKLIST_FIELD
    ]

    handleLoad(event) {
        console.log('form loaded')
        let record = event.detail.records;
        console.log('record >> ', {...record})
    }

    handleSubmit() {

    }
}