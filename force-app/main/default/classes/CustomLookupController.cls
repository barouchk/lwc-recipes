/**
 * Created by bkandov on 21/10/2020.
 */

public with sharing class CustomLookupController {

    /**
 * use sosl for encrypted fields
 * support sobject/external object/shield fields
*/
    @AuraEnabled(Cacheable=true)
    public static List<SObJectResult> getResults(String ObjectName, String fieldName, String displayName, String value) {

        List<SObjectResult> sObjectResultList = new List<SObjectResult>();

        if (String.isNotEmpty(value)) {

            List<String> fields = displayName.split(',');
            Boolean isExternalObj = ObjectName.contains('__x');
            String IdField = isExternalObj ? 'ExternalId' : 'Id';

            String query;
            List<SObject> sObjects;
            if (isExternalObj) {
                query = 'SELECT ' + String.escapeSingleQuotes(IdField) + ',' + String.escapeSingleQuotes(displayName) +
                        ' FROM ' + String.escapeSingleQuotes(ObjectName) +
                        ' WHERE ' + String.escapeSingleQuotes(fieldName) + ' LIKE \'%'
                        + String.escapeSingleQuotes(value) + '%\' LIMIT 10';
                sObjects = Database.Query(query);
            } else {
                query = 'FIND \'' + String.escapeSingleQuotes(value) + '*\' IN ' + String.escapeSingleQuotes(fieldName) + ' Fields ' +
                        'RETURNING ' + String.escapeSingleQuotes(ObjectName) +
                        ' (' + String.escapeSingleQuotes(IdField) + ',' + String.escapeSingleQuotes(displayName) + ') LIMIT 10';

                List<List<SObject>> searchList = Search.query(query);
                sObjects = searchList[0];
            }

            for (sObject so : sObjects) {

                Map<String, String> fieldDisplayValues = new Map<String, String>();
                String fieldValue;
                if (fields.size() == 1) {
                    fieldValue = (String) so.get(displayName);
                    fieldDisplayValues.put(displayName, fieldValue);
                } else {
                    for (String field : fields) {
                        String fValue = String.valueOf(so.get(field));
                        fieldDisplayValues.put(field, fValue);
                    }
                    fieldValue = String.join(fieldDisplayValues.values(), ' \u2022 ');
                }
                SObjectResult obj;
                if (isExternalObj) {
                    obj = new SObjectResult(so.Id, (String) so.get(IdField), fieldValue);
                } else {
                    obj = new SObjectResult(so.Id, fieldValue);
                }

                obj.FieldsParams.putAll(fieldDisplayValues);
                sObjectResultList.add(obj);
            }
        }

        return sObjectResultList;
    }

    public class SObjectResult {
        @AuraEnabled
        public String Name;

        @AuraEnabled
        public String ExternalId;

        @AuraEnabled
        public Id Id;

        @AuraEnabled
        public Map<String, String> FieldsParams;

        public SObjectResult(Id Id, String Name) {
            this.Id = Id;
            this.Name = Name;
            FieldsParams = new Map<String, String>();
        }

        public SObjectResult(Id Id, String ExternalId, String Name) {
            this(Id, Name);
            this.ExternalId = ExternalId;
        }
    }

}