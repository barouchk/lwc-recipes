import { LightningElement } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';
import OPPORTUNITY_STAGE_NAME_FIELD from '@salesforce/schema/Opportunity.StageName';

export default class CheckboxGroupFromPicklist extends LightningElement {

    // opportunityId
    @api recordId

    // used to store defaultRecordTypeId
    @api defaultRecordType

    // must initial checkbox-group properties
    @track options = []
    @track value = ''

    @wire(getObjectInfo, { objectApiName: OPPORTUNITY_OBJECT })
    oppInfo({ data, error }) {
        if (data) {
            this.defaultRecordType = data.defaultRecordTypeId
        }
    }

    @wire(getPicklistValues, { recordTypeId: '$defaultRecordType', fieldApiName: OPPORTUNITY_STAGE_NAME_FIELD })
    stageValues({ data, error }) {
        if (data) {
            this.options = data.values
        }
    }

    handleChange(event) {
        this.value = event.detail.value;
        console.log('this.value >> ', this.value)
    }
}