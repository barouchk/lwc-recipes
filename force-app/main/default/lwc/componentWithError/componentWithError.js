import { LightningElement, api, wire } from 'lwc'
import { getRecord } from 'lightning/uiRecordApi'

const FIELD = [
    'Opportunity.fieldNotExists__c'
]

export default class ComponentWithError extends LightningElement {

    @api recordId

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    record

    errorCallback(error, stack) {
        console.log('child errorCallback >>', error)
    }
}