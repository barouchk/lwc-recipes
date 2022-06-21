/**
 * Created by bkandov on 07/10/2020.
 */
import {LightningElement, track, wire} from 'lwc';
import {getObjectInfo} from 'lightning/uiObjectInfoApi';

// opportunity
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity'
import OPPORTUNITY_STAGE_FIELD from '@salesforce/schema/Opportunity.StageName'
import OPPORTUNITY_TYPE_FIELD from '@salesforce/schema/Opportunity.Type'

// labels
// custom label - TODO need to create
import greeting from '@salesforce/label/c.greeting'

export default class LoadObjectLabels extends LightningElement {

    opportunityFields = [
        OPPORTUNITY_STAGE_FIELD,
        OPPORTUNITY_TYPE_FIELD
    ]

    @wire(getObjectInfo, {objectApiName: OPPORTUNITY_OBJECT})
    oppInfo({data, error}) {
        if (data) {
            for (let field of this.opportunityFields) {
                this.labels[field.fieldApiName] = data.fields[field.fieldApiName].label
            }
        }
    }

    @track labels = {
        greeting
    }

}