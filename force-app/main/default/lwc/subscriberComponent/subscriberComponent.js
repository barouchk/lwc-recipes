import { LightningElement, api } from 'lwc';

import { subscribeEvent } from 'c/messageServicePublisher'

import callApexWithTimeout from '@salesforce/apex/ApexCalloutController.callApexWithTimeout'
import DYNAMIC_CHANNEL from '@salesforce/messageChannel/DynamicChannel__c';
import DYNAMIC_CHANNEL1 from '@salesforce/messageChannel/DynamicChannel1__c';
import TimeoutComponent from 'c/timeoutComponent';

export default class SubscriberComponent extends LightningElement {

    subscription = null;

    message

    @api channelName

    isLoading

    @api timeout

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    // Encapsulate logic for LMS subscribe.
    subscribeToMessageChannel() {
        // const service = new messageService()
        if (this.channelName == "1") {
            this.subscription = subscribeEvent(DYNAMIC_CHANNEL, this.handleMessage.bind(this))
        }
        else if (this.channelName == "2") {
            this.subscription = subscribeEvent(DYNAMIC_CHANNEL1, this.handleMessage.bind(this))
        }
    }

    // Handler for message received by component
    async handleMessage(event) {
        const { recordId } = event
        this.isLoading = true
        const result = await callApexWithTimeout();
        this.message = recordId;
        this.isLoading = false
    }
}