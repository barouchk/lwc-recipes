public with sharing class GenericRequestCallout {
    private final static EnvSettings__c envSettings = EnvSettings__c.getInstance('Main');
    private final static OutboundService service = OutboundService.getInstance();
    private final static Outbound_Utils outUtils = new Outbound_Utils();
    private final static String federationIdentifier = [SELECT FederationIdentifier FROM User WHERE Id = :UserInfo.getUserId()].FederationIdentifier;
    private final static Set<Integer> successStatusCodes = new Set<Integer> {200, 201};

    public class RequestHeader {
        public String AppID, ServiceName, EnvCode, TransactionID;
        public Integer Timeout;

        public RequestHeader(String serviceName, String transactionId) {
            String salesforce = 'SalesForce';
            this.AppID = salesforce;
            this.ServiceName = getServiceNameFromMetadataEndpoint(serviceName);
            EnvCode = salesforce + '_' + envSettings.Env__c;
            Timeout = Integer.valueOf(envSettings.Timeout__c);
            this.TransactionID = transactionId;
        }
    }

    private static String getServiceNameFromMetadataEndpoint(String serviceName) {
        Service_Endpoint__mdt se = [Select Service_Endpoint__c From Service_Endpoint__mdt Where DeveloperName = :serviceName];
        List<String> endpointParts = se.Service_Endpoint__c.split('/');
        return endpointParts.get(endpointParts.size() - 1);
    }

    public class RequestObject {
        RequestHeader RequestHeader;
        Object InParams;

        public RequestObject(String serviceName, Object inParams, String transactionId) {
            RequestHeader = new RequestHeader(serviceName, transactionId);
            this.InParams = inParams;
        }
    }

    public class Request {
        GeneralRequestHeader RequestHeader;
        RequestObject Request;

        Request(String serviceName, Object inParams) {
            String transactionId = outUtils.generateUUID();
            RequestHeader = new GeneralRequestHeader(transactionId, 'To System name', null);
            Request = new RequestObject(serviceName, inParams, transactionId);
        }
    }

    public class GeneralRequestHeader {
        public String FromSystem = 'Salesforce';
        public final String UserIdentifier = federationIdentifier;
        public String ToSystem, token, TransactionId;

        public GeneralRequestHeader(String transactionId, String toSystem, String token) {
            this.TransactionId = transactionId;
            this.ToSystem = toSystem;
            this.token = token;
        }
    }

    public class ResponseHeader {
        public ResponseHeader() {}

        public ResponseHeader(String errorCode, String errorDesc) {
            Application_Status = errorCode;
            Error = new ResponseHeaderError(errorCode, errorDesc);
        }

        @AuraEnabled public String ServiceName, TransactionID, ESB_Status, Application_Status;
        @AuraEnabled public ResponseHeaderError Error;
    }

    public class ResponseHeaderError {
        public ResponseHeaderError() {}
        public ResponseHeaderError(String errorCode, String errorDesc) {
            ErrCode = errorCode;
            ErrDesc = errorDesc;
        }

        @AuraEnabled public String ErrCode, ErrDesc, StackTrace;
    }

    public virtual class Response {
        @AuraEnabled public ResponseHeader ResponseHeader;
    }

    public virtual class K2VRequest {
        public GeneralRequestHeader RequestHeader;
        public String consumer_id, work_order_number, task_id, exception_filter;

        public K2VRequest(String consumerId, String woNumber, String taskId, String exceptionFilter) {
            RequestHeader = new GeneralRequestHeader(outUtils.generateUUID(), 'To System Constant', outUtils.getTokenFromEnvSetting());
            consumer_id = consumerId;
            work_order_number = woNumber;
            task_id = taskId;
            exception_filter = exceptionFilter;
        }
    }

    public class K2VRequestSingleBA extends K2VRequest {
        public String billing_account_number;

        public K2VRequestSingleBA(String consumerId, String baNumber, String woNumber, String taskId, String exceptionFilter) {
            super(consumerId, woNumber, taskId, exceptionFilter);
            billing_account_number = baNumber;
        }

        public K2VRequestSingleBA(String consumerId, String baNumber, String woNumber, String taskId) {
            this(consumerId, baNumber, woNumber, taskId, null);
        }
    }

    private static Object makeCalloutHelper(String serviceName, Object request, Type responseClass, Boolean insertImmediate, Id recordId, String recordType) {
        System.debug('request: ' + JSON.serializePretty(request));
        HttpResponse response = service.send('ApiGateway', serviceName, JSON.serialize(request), insertImmediate, recordId, recordType);
        String body = response.getBody();
        System.debug('response: ' + JSON.serializePretty(body));
        if(successStatusCodes.contains(response.getStatusCode())) {
            Map<String, Object> responseMap = (Map<String, Object>)JSON.deserializeUntyped(body);
            Map<String, Object> res = responseMap.containsKey('Response') ? (Map<String, Object>)responseMap.get('Response') : responseMap;
            return responseClass == null ? res : JSON.deserialize(JSON.serialize(res), responseClass);
        }
        return null;
    }

    private static Object makeCalloutHelper(String serviceName, Request request, Type responseClass, Boolean insertImmediate) {
        return makeCalloutHelper(serviceName, request, responseClass, insertImmediate, null, null);
    }

    public static Object makeCallout(String serviceName, Object inParams, Type responseClass, Boolean insertImmediate) {
        Request request = new Request(serviceName, inParams);
        return makeCalloutHelper(serviceName, request, responseClass, insertImmediate);
    }

    public static Object makeCallout(String serviceName, Object inParams, Type responseClass) {
        return makeCallout(serviceName, inParams, responseClass, true);
    }

    public static Object makeCallout(String serviceName, Object inParams, Type responseClass, Boolean insertImmediate, Id recordId, String recordType) {
        Request request = new Request(serviceName, inParams);
        return makeCalloutHelper(serviceName, request, responseClass, insertImmediate, recordId, recordType);
    }
}