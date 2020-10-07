/**
 * Created by bkandov on 07/10/2020.
 */

public with sharing class LwcResponse {

    @AuraEnabled
    public Boolean success;

    @AuraEnabled
    public Object data;

    @AuraEnabled
    public String message;

    public LwcResponse() {
        this.success = true;
    }

    public LwcResponse(Object data) {
        this();
        this.data = data;
    }

    public LwcResponse(Object data, String message) {
        this(data);
        this.message = message;
    }

    public LwcResponse(Object data, Boolean success) {
        this(data);
        this.success = success;
    }

    public LwcResponse(Object data, String message, Boolean success) {
        this(data, message);
        this.success = success;
    }
}