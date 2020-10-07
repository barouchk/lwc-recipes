/**
 * Created by bkandov on 07/10/2020.
 */
import {wire} from 'lwc';
import {getObjectInfo} from 'lightning/uiObjectInfoApi';

import {LightningComponent} from 'c/lightningComponent'

// opportunity
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity'
import OPPORTUNITY_STAGE_FIELD from '@salesforce/schema/Opportunity.StageName'
import OPPORTUNITY_TYPE_FIELD from '@salesforce/schema/Opportunity.Type'

// labels
// custom label - TODO need to create
import greeting from '@salesforce/label/c.greeting'

export default class LoadObjectLabels extends LightningComponent {

    connectedCallback() {
        // REMOVE THIS LINE IF GETTING ERROR
        this.setLabels({greeting})
    }

    opportunityFields = [
        OPPORTUNITY_STAGE_FIELD,
        OPPORTUNITY_TYPE_FIELD
    ]

    @wire(getObjectInfo, {objectApiName: OPPORTUNITY_OBJECT})
    oppInfo({data, error}) {
        if (data) {
            const labels = {}
            this.opportunityFields.forEach(field => {
                const {fieldApiName} = field
                labels[fieldApiName] = data.fields[fieldApiName].label
            })
            this.setLabels(labels)
        }
    }

}