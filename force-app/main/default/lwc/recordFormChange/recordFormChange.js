/**
 * Created by bkandov on 28/01/2021.
 */

import {LightningElement, api, wire} from 'lwc';
import {getRecord} from 'lightning/uiRecordApi'

import OPPORTUNITY_ID from '@salesforce/schema/Opportunity.Id'

export default class RecordFormChange extends LightningElement {

    recordId

    @api get valueId() {
        return this.recordId
    }

    set valueId(value) {
        this.recordId = value
        if (!this.valueId) {
            this.clearData()
        }
    }


    connectedCallback() {
        console.log('connectedCallback >> ', this.valueId)
    }

    @wire(getRecord, {recordId: '$recordId', fields: [OPPORTUNITY_ID]})
    record({data, error}) {
        console.log('data >> ', data, '  error >> ', error, '  valueId >> ', this.valueId)
    }

    clearData() {

    }
}