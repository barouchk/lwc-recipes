/**
 * Created by bkandov on 21/10/2020.
 */

import {LightningElement, wire, api, track} from 'lwc';
import DIR from '@salesforce/i18n/dir'
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {getObjectInfo} from 'lightning/uiObjectInfoApi';
import {getRecord} from 'lightning/uiRecordApi';

import getResults from '@salesforce/apex/CustomLookupController.getResults';

export default class CustomLookup extends LightningElement {

    @api valueId;
    @api objName;
    // field to search by
    @api fieldName;
    // field to show in the combobox
    @api fieldNameDisplay;
    @api iconName;
    @api labelName;
    @api filter = '';
    @api showLabel = false;
    @api required;
    @api uniqueId;
    @api placeholder;
    objLabelName;
    @track error;

    get newObjectCreationLabel() {
        // if (DIR === 'rtl') {
        //     return `${this.objLabelName} ${NEW_LABEL}`;
        // }
        return `New ${this.objLabelName}`;
    }

    /*Create Record Start*/
    @api createRecord;
    @track recordTypeOptions;
    @track createRecordOpen;
    @track recordTypeSelector;
    @track mainRecord;
    @track isLoaded = false;

    get isLabelExists() {
        return this.labelName != undefined;
    }

    //For Stencil
    @track stencilClass = '';
    @track stencilReplacement = 'slds-hide';
    //css
    @track myPadding = 'slds-modal__content';
    /*Create Record End*/

    searchTerm;
    @track valueObj;
    href;
    @track options; //lookup values
    @track isValue;
    @track blurTimeout;

    blurTimeout;

    //css
    @track boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    @track inputClass = '';
    @track dropDownClass = 'slds-dropdown slds-dropdown_length-with-icon-7 slds-dropdown_fluid'

    connectedCallback() {
        // support hebrew
        if (DIR === 'rtl') {
            this.dropDownClass += ' slds-dropdown_right'
        }
    }

    @api
    get queryFields() {

        const fieldsArray = this.fieldNameDisplay.split(",");
        const fields = [];

        for (let field of fieldsArray) {
            fields.push(`${this.objName}.${field}`)
        }

        return fields;
    }

    //Used for creating Record Start
    @wire(getObjectInfo, {objectApiName: '$objName'})
    wiredObjectInfo({error, data}) {
        if (data) {
            this.record = data;
            this.error = undefined;
            this.objLabelName = data.label;
            let recordTypeInfos = Object.entries(this.record.recordTypeInfos);
            if (recordTypeInfos.length > 1) {
                let temp = [];
                recordTypeInfos.forEach(([key, value]) => {
                    if (value.available === true && value.master !== true) {
                        temp.push({"label": value.name, "value": value.recordTypeId});
                    }
                });
                this.recordTypeOptions = temp;
            } else {
                this.recordTypeId = this.record.defaultRecordTypeId;
            }
        } else if (error) {
            console.log('error in wire')
            this.error = error;
            this.record = undefined;
            console.log("this.error", this.error);
        }
    }

    @wire(getResults, {
        ObjectName: '$objName',
        fieldName: '$fieldName',
        displayName: '$fieldNameDisplay',
        value: '$searchTerm'
    })
    wiredRecords({error, data}) {
        if (data) {
            this.record = data;
            this.error = undefined;
            this.options = this.record;
            this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
            if (this.options.length > 0 || this.createRecord)
                this.boxClass = +' slds-is-open';

        } else if (error) {
            this.error = error;
            this.record = undefined;
            this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus'
            console.log("wire.error", this.error);
        }
    }

    //To get preselected or selected record
    @wire(getRecord, {recordId: '$valueId', fields: '$queryFields'})
    wiredOptions({error, data}) {
        if (data) {
            this.record = data;
            this.error = undefined;
            const fieldsArray = this.fieldNameDisplay.split(",");

            if (fieldsArray.length == 1) {
                this.valueObj = this.record.fields[this.fieldNameDisplay].value;
            } else {
                var values = [];
                for (var fieldName of fieldsArray) {
                    values.push(this.record.fields[fieldName].value);
                }
                this.valueObj = values.join(' \u2022 ');
            }
            this.href = '/' + this.record.id;
            this.isValue = true;
        } else if (error) {
            console.log('error in wire', this.valueId)
            this.error = error;
            this.record = undefined;
            console.log("this.error", this.error);
        }
    }

    handleClick() {
        this.searchTerm = '';
        this.inputClass = 'slds-has-focus';
    }

    inblur() {
        this.blurTimeout = setTimeout(() => {
            this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus'
        }, 250);
    }

    onSelect(event) {
        let ele = event.currentTarget;
        let selectedId = ele.dataset.id;
        let externalId = this.objName.includes('__x') ? ele.dataset.external : ''

        let element = this.options.find(o => o.Id == selectedId)
        let fieldsParams = element.FieldsParams;
        //As a best practise sending selected value to parent and inreturn parent sends the value to @api valueId
        const valueSelectedEvent = new CustomEvent('valueselect', {
            detail: {selectedId, externalId, fieldsParams, uniqueId: this.uniqueId},
        });
        this.dispatchEvent(valueSelectedEvent);

        if (this.blurTimeout) {
            clearTimeout(this.blurTimeout);
        }
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    }

    onChange(event) {
        this.searchTerm = event.target.value;
    }

    handleRemovePill() {
        this.isValue = false;
        let selectedId = '';
        const valueSelectedEvent = new CustomEvent('valueselect', {
            detail: {selectedId, uniqueId: this.uniqueId},
        });
        this.dispatchEvent(valueSelectedEvent);
    }

    createRecordFunc() {
        if (this.recordTypeOptions) {
            this.recordTypeSelector = true;
        } else {
            this.recordTypeSelector = false;
            this.mainRecord = true;
            //stencil before getting data
            this.stencilClass = '';
            this.stencilReplacement = 'slds-hide';
        }
        this.createRecordOpen = true;
    }

    handleRecTypeChange(event) {
        this.recordTypeId = event.target.value;
    }

    createRecordMain() {
        this.recordTypeSelector = false;
        this.mainRecord = true;
        //stencil before getting data
        this.stencilClass = '';
        this.stencilReplacement = 'slds-hide';
    }

    handleLoad(event) {
        let details = event.detail;

        if (details) {
            setTimeout(() => {
                this.stencilClass = 'slds-hide';
                this.stencilReplacement = '';
                this.myPadding = 'slds-p-around_medium slds-modal__content';
            }, 1000);
        }
    }

    handleSubmit() {
        this.template.querySelector('lightning-record-form').submit();
    }

    handleSuccess(event) {

        this.createRecordOpen = false;
        this.mainRecord = false;
        this.stencilClass = '';
        this.stencilReplacement = 'slds-hide';
        let selectedId = event.detail.id;
        const valueSelectedEvent = new CustomEvent('valueselect', {
            detail: {selectedId, uniqueId: this.uniqueId},
        });
        this.dispatchEvent(valueSelectedEvent);

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: `Record saved successfully with id: ${event.detail.id}`,
                variant: 'success',
            }),
        )
    }

    handleError(res) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: 'Error saving the record',
                variant: 'error',
            }),
        )
    }

    closeModal() {
        this.stencilClass = '';
        this.stencilReplacement = 'slds-hide';
        this.createRecordOpen = false;
        this.recordTypeSelector = false;
        this.mainRecord = false;
    }

    labels = {
    }

}