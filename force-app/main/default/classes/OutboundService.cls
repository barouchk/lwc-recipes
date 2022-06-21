/**
 * Created by ilana.brodsky on 04/08/2020.
    * @modifiedBy     
    * @version        
    * @created        04/08/2020
    * @modified      
 */

global with sharing class OutboundService {
    private final String MAP_DELIMITER = '--';
    private final String ORG_NAME_SERVICE_DELIMITER = '_';

    private Set<String> serviceNameSet = new Set<String>();
    private Map<String, ServiceSettingObj> servicesSettingsMap = new Map<String, ServiceSettingObj>();
    private List<Service_Endpoint__mdt> serviceEndpointList = new List<Service_Endpoint__mdt>();
    private static EnvSettings__c envSettings = EnvSettings__c.getInstance('Main');
    private String orgName;
    private String destination;
    private String transactionId;
    private String federationId = '';
    private Map<String, NamedCredential> nameCredentialsMap = new Map<String, NamedCredential>();

    private static OutboundService OutboundServiceObj;

    private Id recordId;
    private String recordType;

    private OutboundService() {
        orgName = envSettings.Env__c;
        Destination = 'APIGATEWAY';
        getNameCreds();
        getServiceEndpoints();
        populateServiceSettingMap();

    }

    // Singelton Pattern
    global static OutboundService getInstance() {
        if (OutboundServiceObj == null) {
            OutboundServiceObj = new OutboundService();
        }
        return OutboundServiceObj;
    }

    private void getNameCreds() {
        String orgNameExp = orgName + '%'; //getOrgName()
        List<NamedCredential> ncs = [
                SELECT Id,developerName, Endpoint, PrincipalType
                FROM NamedCredential
                WHERE developerName LIKE :orgNameExp
        ];
        System.debug('name creds ' + ncs);
        if (!ncs.isEmpty()) {
            String serviceName;
            for (NamedCredential ncVar : ncs) {
                serviceName = (ncVar.DeveloperName).subStringAfter(ORG_NAME_SERVICE_DELIMITER);
                this.nameCredentialsMap.put(serviceName, ncVar);
                this.serviceNameSet.add(serviceName);

            }
        } else {
            throw new OutboundServiceException('NO NAME CREDENTIALS EXCEPTION' + '\tOrg Name: ' + orgName);
        }
        System.debug('this.nameCredentialsMap from populate ' + this.nameCredentialsMap);
    }

    private void getServiceEndpoints() {
        this.serviceEndpointList = [
                SELECT Label, Content_Type__c, DeveloperName,Accept__c, Service_Endpoint__c, Method_Type__c, Service_Name__c,Headers__c,
                        Accept_Encoding__c, Include_Token__c
                FROM Service_Endpoint__mdt
                WHERE Service_Name__c IN :serviceNameSet
                AND Is_Active__c = true
        ];

        if (this.serviceEndpointList.isEmpty()) {
            throw new OutboundServiceException('NO_ACTIVE_ENDPOINTS_EXCEPTION');
        }
    }

    private void populateServiceSettingMap() {
        for (Service_Endpoint__mdt serviceEndpointItem : this.serviceEndpointList) {
            NamedCredential ncVar = this.nameCredentialsMap.get(serviceEndpointItem.Service_Name__c); //ApiGateway
            ServiceSettingObj mtdSetting = createServiceSetting(serviceEndpointItem, ncVar);
            String methodKey = serviceEndpointItem.Service_Name__c + MAP_DELIMITER + serviceEndpointItem.DeveloperName; //ApiGateway--CreateLead
            this.servicesSettingsMap.put(methodKey, mtdSetting);
        }
    }

    private String generateUUID() {
        Blob b = Crypto.GenerateAESKey(128);
        String convertedToHex = EncodingUtil.ConvertTohex(b);
        String guid = convertedToHex.SubString(0, 8) + '-' + convertedToHex.SubString(8, 12)
                + '-' + convertedToHex.SubString(12, 16) + '-'
                + convertedToHex.SubString(16, 20) + '-' + convertedToHex.substring(20);
        return guid;
    }

    private String getContentTypeValue(ServiceSettingObj serviceSetting) {
        String contentTypeValue = serviceSetting.contentType;
        if (!String.isEmpty(contentTypeValue)) {
            return contentTypeValue;
        } else {
            throw new OutboundServiceException('no contact type');
        }
    }

    private Map<String, String> populateHeaders(ServiceSettingObj serviceSetting) {
        String stringHeaders = serviceSetting.headers;
        Map<String, Object> jsonMap = new Map<String, Object>();
        Map<String, String> headersMap = new Map<String, String>();

        if (!String.isEmpty(stringHeaders)) {
            jsonMap = (Map<String, Object>) JSON.deserializeUntyped(stringHeaders);
            for (String key : jsonMap.keySet()) {
                if (!String.isEmpty(key) && jsonMap.get(key) != null) {
                    headersMap.put(key, String.valueOf(jsonMap.get(key)));
                } else {
                    throw new OutboundServiceException('Headers problem');
                }
            }
        } else {
            throw new OutboundServiceException('Headers problem');
        }
        return headersMap;
    }
    private void findRequestHeaderParams(String requestJson) {
        Map<String, Object> requestObjectsMap = (Map<String, Object>) JSON.deserializeUntyped(requestJson);
        Map<String, Object> requestHeaderMap = (Map<String, Object>) requestObjectsMap.get('RequestHeader');
        if (!requestHeaderMap.isEmpty() && requestHeaderMap != null) {
            String TransactionID = (String) requestHeaderMap.get('TransactionId');
            //system.debug('TransactionId '+TransactionID);
            this.transactionId = TransactionID != null ? TransactionID : generateUUID();
            if ((String)requestHeaderMap.get('ToSystem') != null) {
                this.destination = (String) requestHeaderMap.get('ToSystem');
            }
            if ((String)requestHeaderMap.get('UserIdentifier') != null) {
                this.federationId = (String) requestHeaderMap.get('UserIdentifier');
            }


        } else {
            this.transactionId = generateUUID();
        }
    }

    private ServiceSettingObj createServiceSetting(Service_Endpoint__mdt serviceEndpointItem, NamedCredential ncVar) {
        ServiceSettingObj srvSetting = new ServiceSettingObj();
        // Service Envirment  Items
        srvSetting.envId = ncVar.Id;
        srvSetting.Env = envSettings.Env__c;
        srvSetting.timeout = Integer.valueOf(envSettings.Timeout__c);
        srvSetting.label = ncVar.DeveloperName;//serviceEnvVarItem.Label;
        // ServiceEndpoint Items
        srvSetting.serviceName = serviceEndpointItem.Service_Name__c;
        srvSetting.methodName = serviceEndpointItem.DeveloperName;
        srvSetting.methodType = serviceEndpointItem.Method_Type__c;
        srvSetting.contentType = serviceEndpointItem.Content_Type__c;
        srvSetting.AcceptEncoding = serviceEndpointItem.Accept_Encoding__c;
        srvSetting.accept = serviceEndpointItem.Accept__c;
        srvSetting.headers = serviceEndpointItem.Headers__c;
        // Combination
        srvSetting.endPoint = 'callout:' + ncVar.DeveloperName + (serviceEndpointItem.Service_Endpoint__c == null ? '' : serviceEndpointItem.Service_Endpoint__c) +
                (serviceEndpointItem.Include_Token__c ? envSettings.EndPoint_Token__c : '');
        srvSetting.serviceEndpoints = serviceEndpointItem;
        return srvSetting;
    }


    global HTTPResponse send(ServiceSettingObj calloutSetting, String body, Boolean insertImmediate) {
        findRequestHeaderParams(body);
        Datetime startDate = Datetime.now();
        if (body == null) {
            throw new OutboundServiceException('body is null exception');
        }

        HttpRequest req = new HttpRequest();
        //String transactionId;
        Boolean isGet = calloutSetting.methodType == 'GET' ? true : false;

        req.setMethod(calloutSetting.methodType);

        if (isGet) {
            //ENDPOINT FOR GET- No body
            req.setEndpoint(calloutSetting.endPoint + body);
        } else {
            //ENDPOINT FOR POST >>>
            req.setEndpoint(calloutSetting.endPoint);
            System.debug('endpoint ' + req.getEndpoint());
            //transactionId = findTransactionId(body);
            req.setBody(body);
        }

        //SET HEADERS
        //CONTENT-TYPE
        String contentTypeFormatted = getContentTypeValue(calloutSetting);
        if (!String.isEmpty(contentTypeFormatted)) {
            req.setHeader('Content-Type', contentTypeFormatted);
        }
        if (!String.isEmpty(calloutSetting.accept)) {
            req.setHeader('Accept', calloutSetting.accept);
        }

        //Additional Headers:
        if (!String.isEmpty(calloutSetting.env)) {
            req.setHeader('Env', calloutSetting.env);
        }

        req.setHeader('TransactionID', this.transactionId);
        req.setHeader('UserNt', this.federationId);
        system.debug('UserNt ' + this.federationId);

        if (!String.isEmpty(calloutSetting.AcceptEncoding)) {
            System.debug(calloutSetting.AcceptEncoding + ' AcceptEncoding');
            req.setHeader('Accept-Encoding', calloutSetting.AcceptEncoding);

        }

        //CUSTOM HEADERS
        if (calloutSetting.headers != null) {
            Map<String, String> headersMap = populateHeaders(calloutSetting);
            for (String key : headersMap.keySet()) {
                req.setHeader(key, headersMap.get(key));
            }
        }

        //req.setCompressed(calloutSetting.isCompressed);

        //Set timeout
        if (calloutSetting.timeout != null && calloutSetting.timeout > 10) {
            //In miliseconds
            Integer timeout = calloutSetting.timeout * 1000;
            req.setTimeout(timeout);
        }

        // Create a new http object to send the request object
        Http http = new Http();
        HttpResponse res = http.send(req);
        writeIntoLog(startDate, Datetime.now(), this.transactionId, body, res.getBody(), this.destination, insertImmediate, calloutSetting);
        return res;

    }

    /**
     * Callout to service by name, method and body -*** The global main method that will be called ***
     * Author	: Ilana Brodsky
     *
     * @method	: send
     * @since	: 05/08/2020
     *
     * @param {String}			: Service name field from the relevant endpoint in the Meta Data- example : ApiGateway
     * @param {String}			: Service method name field - the relevant name of the endpoint that will be do the callout
     * @param {String}			: Payload - serialized mapping
     * @return {HTTPResponse}	: Response
     */

    global HTTPResponse send(String serviceName, String methodName, String body) {
        return send(serviceName, methodName, body, true);
    }
    //call this method if multiple callouts is made in 1 transaction
    global HTTPResponse send(String serviceName, String methodName, String body, Boolean insertImmediate) {
        ServiceSettingObj calloutSetting = getServiceSetting(serviceName, methodName);
        return send(calloutSetting, body, insertImmediate);
    }

    //call this method if multiple callouts is made in 1 transaction
    global HTTPResponse send(String serviceName, String methodName, String body, Boolean insertImmediate, Id recordId, String recordType) {
        ServiceSettingObj calloutSetting = getServiceSetting(serviceName, methodName);
        this.recordId = recordId;
        this.recordType = recordType;
        return send(calloutSetting, body, insertImmediate);
    }

    global ServiceSettingObj getServiceSetting(String serviceName, String methodName) {
        String serviceKey = serviceName + MAP_DELIMITER + methodName;
        if (!this.servicesSettingsMap.containsKey(serviceKey)) {
            throw new OutboundServiceException('service settings map problem ' + serviceName + MAP_DELIMITER + methodName);
        }
        return this.servicesSettingsMap.get(serviceKey);
    }

    private void writeIntoLog(Datetime startDate, Datetime endDate, String transactionId, String body, String resBody, String Destination, Boolean insertImmediate, ServiceSettingObj calloutSetting) {
        // System.debug('inside log create');
        // String federationId = this.federationId;
        // LogService.LogEntryData data = new LogService.LogEntryData();
        // data.Agent = federationId;
        // data.Type = 'Outbound'; // ENV
        // data.Transaction_Id = transactionId;
        // data.FROM_Source = 'SalesForce'; // ENV
        // data.TO_Destination = Destination; //YES/PEL/BBL/MDM/Tibco
        // data.JSON_Request = body;
        // data.JSON_Response = resBody;
        // data.Start_Date = startDate;
        // data.End_Date = endDate;
        // data.Service_Name = calloutSetting.serviceEndpoints.DeveloperName;
        // data.Service_Endpoint = calloutSetting.serviceEndpoints.Service_Endpoint__c;
        // data.Record_Id = this.recordId;
        // data.Record_Type = this.recordType;

        // LogService.insertLogSync(data, insertImmediate); //add another param - boolean
    }


    global Class ServiceSettingObj {
        public String serviceName;
        public String methodName;
        public String methodType;
        public Integer timeout;
        public Boolean isCompressed;
        public String contentType;
        public String accept;
        public String headers;
        public String endPoint;
        public String Env;
        public String AcceptEncoding;
        public String TransactionID;
        public String label;
        public Id envId;
        public Service_Endpoint__mdt serviceEndpoints;
        public ServiceSettingObj() {
        }
    }

    global Class OutboundServiceException Extends Exception {
    }
}