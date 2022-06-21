import { LightningElement,api } from 'lwc';
import callApexWithTimeout from '@salesforce/apex/ApexCalloutController.callApexWithTimeout'

export default class TimeoutComponent extends LightningElement {

    @api timeout = 1000

    isLoading = true;
    
    data

    startTime
    endTime

    connectedCallback(){
        this.startTime = new Date().getTime();
        this.callApex()
    }

    callApex({}){
        callApexWithTimeout({timeout})
        .then(this.handleApexCallResponse.bind(this))
        .catch(error => {
            console.log('callApex error >> ', error)
        })
    }

    handleApexCallResponse(res){
        this.endTime = new Date().getTime();

        data = `Data Loaded ${this.endTime - this.startTime}`
    }

}