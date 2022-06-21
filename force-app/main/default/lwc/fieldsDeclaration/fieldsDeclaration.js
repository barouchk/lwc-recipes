/**
 * Created by bkandov on 25/10/2020.
 */

import {LightningElement, track, api, wire} from 'lwc';
import {getRecord} from 'lightning/uiRecordApi';

// contact
import CONTACT_FIRST_NAME_FIELD from '@salesforce/schema/Contact.FirstName'
import CONTACT_LAST_NAME_FIELD from '@salesforce/schema/Contact.LastName'
import CONTACT_PHONE_FIELD from '@salesforce/schema/Contact.Phone'
import CONTACT_EMAIL_FIELD from '@salesforce/schema/Contact.Email'
import CONTACT_AGE_FIELD from '@salesforce/schema/Contact.Age__c'

const CONTACT_FIELDS = [
    CONTACT_FIRST_NAME_FIELD,
    CONTACT_LAST_NAME_FIELD,
    CONTACT_PHONE_FIELD,
    CONTACT_EMAIL_FIELD,
    CONTACT_AGE_FIELD
]

export default class FieldsDeclaration extends LightningElement {

    @api recordId

    @track contact = {}

    @track contactWithApiNames = {}

    @wire(getRecord, {recordId: '$recordId', fields: CONTACT_FIELDS})
    wiredContact({error, data}) {
        if (data) {
            console.log('wire loaded >> ', {...data})
            this.contact = {
                firstName: data.fields[CONTACT_FIRST_NAME_FIELD.fieldApiName].value,
                lastName: data.fields[CONTACT_LAST_NAME_FIELD.fieldApiName].value,
                phone: data.fields[CONTACT_PHONE_FIELD.fieldApiName].value,
                email: data.fields[CONTACT_EMAIL_FIELD.fieldApiName].value,
                age: data.fields[CONTACT_AGE_FIELD.fieldApiName].value,

            }

            for (let field of CONTACT_FIELDS) {
                this.contactWithApiNames[field.fieldApiName] = data.fields[field.fieldApiName].value
            }
        }
    }
}