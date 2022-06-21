import { LightningElement, api } from 'lwc';

import { publishEvent } from 'c/messageServicePublisher'
import DYNAMIC_CHANNEL from '@salesforce/messageChannel/DynamicChannel__c';
import DYNAMIC_CHANNEL1 from '@salesforce/messageChannel/DynamicChannel1__c';

export default class PublisherComponent extends LightningElement {

    @api recordId;

    // service;

    connectedCallback() {
        // this.service = new messageService();
    }

    handleButtonClicked(event) {
        console.log({ ...event })
        const { name } = event.target

        const { recordId } = this
        let channel;
        if (name == "1") {
            publishEvent(DYNAMIC_CHANNEL, { recordId });
        } else if (name == "2") {
            publishEvent(DYNAMIC_CHANNEL1, { recordId });
        }
    }
}