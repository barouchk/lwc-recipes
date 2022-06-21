public with sharing class GenericInvocableRequest {
    public virtual class Request {
        @InvocableVariable(label='Service Endpoint Developer Name' description='Service_Endpoint__mdt DeveloperName' required=true)
        public String serviceEndpoint;

        @InvocableVariable(label='Request Parameters' Description='InParams' required=true)
        public String paramsJson;

        @InvocableVariable(label='Record ID' description='the record id that will be associated with the Custom_Log__c record' required=false)
        public String recordId;

        @InvocableVariable(label='Record Type' description='the record type that will be associated with the Custom_Log__c record' required=false)
        public String recordType;

        @InvocableVariable(label='Status Code Path' description='which response field will return in Status Code output field' required=false)
        public String statusCodePath;

        @InvocableVariable(label='Status Description Path' description='which response field will return in Status Description output field' required=false)
        public String statusDescPath;

        @InvocableVariable(label='Output1 Path' description='JSON path for output value' required=false)
        public String output1Path;

        @InvocableVariable(label='Output2 Path' description='JSON path for output value' required=false)
        public String output2Path;

        @InvocableVariable(label='Output3 Path' description='JSON path for output value' required=false)
        public String output3Path;

        @InvocableVariable(label='Output4 Path' description='JSON path for output value' required=false)
        public String output4Path;

        @InvocableVariable(label='Output5 Path' description='JSON path for output value' required=false)
        public String output5Path;

        @InvocableVariable(label='Output6 Path' description='JSON path for output value' required=false)
        public String output6Path;

        @InvocableVariable(label='Output7 Path' description='JSON path for output value' required=false)
        public String output7Path;

        @InvocableVariable(label='Output8 Path' description='JSON path for output value' required=false)
        public String output8Path;

        @InvocableVariable(label='Output9 Path' description='JSON path for output value' required=false)
        public String output9Path;

        @InvocableVariable(label='Output10 Path' description='JSON path for output value' required=false)
        public String output10Path;

        @InvocableVariable(label='Output11 Path' description='JSON path for output value' required=false)
        public String output11Path;

        @InvocableVariable(label='Output12 Path' description='JSON path for output value' required=false)
        public String output12Path;

        @InvocableVariable(label='Output13 Path' description='JSON path for output value' required=false)
        public String output13Path;

        @InvocableVariable(label='OutputCollection1 Path' description='JSON path for output collection value' required=false)
        public String outputCollection1Path;

        @InvocableVariable(label='OutputCollection1 Keys' description='Collections key to retrieve values by' required=false)
        public String outputCollection1Keys;
        
        @InvocableVariable(label='Insert Immediate' description='Insert Callout Logs To Database' required=false)
        public Boolean insertImmediate;
        
    }

    public class Response {
        @InvocableVariable(label='Response Status Code')
        public String statusCode;

        @InvocableVariable(label='Response Status Description')
        public String statusDesc;

        @InvocableVariable(label='Output1')
        public String output1;

        @InvocableVariable(label='Output2')
        public String output2;

        @InvocableVariable(label='Output3')
        public String output3;

        @InvocableVariable(label='Output4')
        public String output4;

        @InvocableVariable(label='Output5')
        public String output5;

        @InvocableVariable(label='Output6')
        public String output6;

        @InvocableVariable(label='Output7')
        public String output7;

        @InvocableVariable(label='Output8')
        public String output8;

        @InvocableVariable(label='Output9')
        public String output9;

        @InvocableVariable(label='Output10')
        public String output10;

        @InvocableVariable(label='Output11')
        public String output11;

        @InvocableVariable(label='Output12')
        public String output12;

        @InvocableVariable(label='Output13')
        public String output13;

        @InvocableVariable(label='CollectionOutput1')
        public List<GenericInvocableCollectionOutput> collectionOutput1;

        @InvocableVariable(label='Response Json')
        public String responseJson;

        // allow access to this input for error handling
        @InvocableVariable(label='Service Endpoint Developer Name' description='Service_Endpoint__mdt DeveloperName')
        public String serviceEndpoint;

        public Response(String statusCode, String statusDesc) {
            this.statusCode = statusCode;
            this.statusDesc = statusDesc;
        }

        public Response(Request request, Map<String, Object> response) {
            this(
                    extractStringFromResponse(request.statusCodePath, response),
                    extractStringFromResponse(request.statusDescPath, response)
            );

            output1 = extractStringFromResponse(request.output1Path, response);
            output2 = extractStringFromResponse(request.output2Path, response);
            output3 = extractStringFromResponse(request.output3Path, response);
            output4 = extractStringFromResponse(request.output4Path, response);
            output5 = extractStringFromResponse(request.output5Path, response);
            output6 = extractStringFromResponse(request.output6Path, response);
            output7 = extractStringFromResponse(request.output7Path, response);
            output8 = extractStringFromResponse(request.output8Path, response);
            output9 = extractStringFromResponse(request.output9Path, response);
            output10 = extractStringFromResponse(request.output10Path, response);
            output11 = extractStringFromResponse(request.output11Path, response);
            output12 = extractStringFromResponse(request.output12Path, response);
            output13 = extractStringFromResponse(request.output13Path, response);
            collectionOutput1 = extractCollectionFromResponse(request.outputCollection1Path, request.outputCollection1Keys, response);
            responseJson = JSON.serialize(response);
            serviceEndpoint = request.serviceEndpoint;
        }
    }

    @InvocableMethod (label='Make Callout' callout=true category='Invocable Callouts')
    public static List<Response> invoke(List<Request> requests) {
        List<Response> responses = new List<Response>();
        for(Request request: requests) {
            try {
                responses.add(new Response(request, makeCallout(
                        request.serviceEndpoint,
                        parseJson(request.paramsJson),
                        request.recordId,
                        request.recordType,
                        request.insertImmediate
                )));
            } catch(Exception ex) {
                System.debug('exception ocurred: ' + ex + '\nstack: ' + ex.getStackTraceString());
                responses.add(new Response('95', 'Empty Callout' + '\n' + ex.getMessage()));
            }
        }
        return responses;
    }

    @AuraEnabled(Cacheable=false)
    public static Map<String, Object> makeCallout(
        String serviceEndpoint, Map<String, Object> params,
        String recordId, String recordType, Boolean insertImmediate) {
        if (insertImmediate == null) {
            insertImmediate = true;
        }
        Map<String, Object> response;
        if(Service_Endpoint__mdt.getInstance(serviceEndpoint) != null) {
            // Make callout for non-TIBCO endpoint
            Outbound_Utils outUtils = new Outbound_Utils();
            params.put('RequestHeader', new GenericRequestCallout.GeneralRequestHeader(outUtils.generateUUID(), 'To system name', outUtils.getTokenFromEnvSetting()));
            response = (Map<String, Object>)GenericRequestCallout.makeCallout(serviceEndpoint, params, null, true);
        }
        return response;
    }

    private static Object extractObjectFromResponse(String keyPath, Map<String, Object> responseMap) {
        if(String.isEmpty(keyPath)) {
            return null;
        }

        Object currentPathValue = responseMap;
        List<String> pathKeys = keyPath.split('\\.');
        for(String key : pathKeys) {
            try {
                if(key.endsWith(']')) {
                    Integer indexOfStartingBracket = key.indexOf('[');
                    String keyWithoutBrackets = key.left(indexOfStartingBracket);
                    List<Object> objectList = (List<Object>)((Map<String, Object>)currentPathValue).get(keyWithoutBrackets);
                    Integer index = Integer.valueOf(key.substring(keyWithoutBrackets.length() + 1, key.length() - 1));
                    currentPathValue = index < objectList.size() ? objectList.get(index) : null;
                } else {
                    currentPathValue = ((Map<String, Object>)currentPathValue).get(key);
                }

                if(currentPathValue == null) {
                    return null;
                }
            } catch(Exception ex) {
                System.debug('exception parsing path key ' + key + '\nkeyPath: ' + keyPath + '\n' + ex + '\nstack: ' + ex.getStackTraceString());
                return null;
            }
        }

        return currentPathValue;
    }
    private static String extractStringFromResponse(String keyPath, Map<String, Object> responseMap) {
        Object currentPathValue = extractObjectFromResponse(keyPath, responseMap);
        return currentPathValue == null?null:String.valueOf(currentPathValue);
    }

    private static List<GenericInvocableCollectionOutput> extractCollectionFromResponse(String keyPath, String collectionKeys, Map<String, Object> responseMap){
        if(String.isEmpty(keyPath)) {
            return null;
        }
        List<GenericInvocableCollectionOutput> collectionOutput = new List<GenericInvocableCollectionOutput>();

        String collectionJSON = JSON.serialize(extractObjectFromResponse(keyPath, responseMap));

        List<String> keys = collectionKeys?.split(';');
        List<Object> collectionObjects = (List<Object>) JSON.deserializeUntyped(collectionJSON);

        for (Object obj : collectionObjects) {
            GenericInvocableCollectionOutput co = new GenericInvocableCollectionOutput();
            if(keys == null) {
                co.values.add((String)obj);
            } else {
                for (String key : keys) {
                    co.values.add(extractStringFromResponse(key, (Map<String, Object>)obj));
                }
            }

            collectionOutput.add(co);
        }

        System.debug('collectionOutput: ' + collectionOutput);

        if ( collectionOutput.size() == 0 ) {
            return null;
        }
        return collectionOutput;
    }

    private static Map<String, Object> parseJson(String paramsJson) {
        Map<String, Object> parsed;
        try {
            parsed = (Map<String, Object>)JSON.deserializeUntyped(paramsJson);
        } catch(Exception ex) {
            System.debug('ex:' + ex + ', paramsJson: ' + paramsJson);
            parsed = (Map<String, Object>)JSON.deserializeUntyped(paramsJson.replace('\\', '\\\\'));
        }

        return parsed;
    }
}