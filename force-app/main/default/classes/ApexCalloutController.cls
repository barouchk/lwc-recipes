/**
 * Created by bkandov on 07/10/2020.
 */

public with sharing class ApexCalloutController {

    @AuraEnabled
    public static LwcResponse callApex(Boolean isSuccess) {
        if (isSuccess) {
            return new LwcResponse('test data', 'data load successfully');
        }
        return new LwcResponse(null, 'there is no data to show', false);
    }

    @AuraEnabled
    public static LwcResponse callApexException() {
        throw new AuraHandledException('test error');
    }


}