import { LightningElement } from 'lwc';

import makeCallout from "@salesforce/apex/GenericInvocableRequest.makeCallout";

export default class GenericLwcCallout extends LightningElement {

    getDetails = async () => {
        try {
            const response = await makeCallout({
                serviceEndpoint: "SERVICE_ENDPOINT_API_NAME",
                recordId: this.recordId,
                params: {
                    billing_accounts: [
                       '123456'
                    ],
                    exception_filter: "1"
                }               
            });

            if (response) {
                console.log('response')

            }
        } catch (error) {
            console.error("error >> ", {...error});
        }
    }


}