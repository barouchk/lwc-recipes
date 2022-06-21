public with sharing class ServiceController {

    @AuraEnabled
    public static List<String> getProducts(){
        try {
            List<Contact> contacts = [SELECT Id,Age__c FROM Contact LIMIT 5];
            return new List<String>{'aaa','bbb'};
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}