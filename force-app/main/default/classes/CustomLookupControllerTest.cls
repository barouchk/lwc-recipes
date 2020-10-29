/**
 * Created by bkandov on 28/10/2020.
 */

@IsTest
public with sharing class CustomLookupControllerTest {

    @testSetup
    static void setupData() {
        List<Lead> leads = new List<Lead>();
        leads.add(new Lead(LastName = 'test1', Company = 'test'));
        leads.add(new Lead(LastName = 'test2', Company = 'test'));

        insert leads;
    }

    @IsTest
    public static void getResultsTest() {

        Map<String, Lead> leadsMap = new Map<String, Lead>([SELECT Id,Name from Lead]);

        Test.setFixedSearchResults(new List<String>(leadsMap.keySet()));
        Test.startTest();

        List<CustomLookupController.SObjectResult> objects = CustomLookupController.getResults
                ('Lead', 'Name', 'Name', 'test');
        System.assert(objects.size() == 2);

        objects = CustomLookupController.getResults
                ('Lead', 'Name', 'Name,LastName', 'test');

        System.assert(objects.size() == 2);
        Test.stopTest();
    }

}