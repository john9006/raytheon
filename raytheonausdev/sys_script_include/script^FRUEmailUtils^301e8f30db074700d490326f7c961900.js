var FRUEmailUtils = Class.create();//
FRUEmailUtils.prototype = {
    initialize: function() {
        this.dbg = new FRUDebugUtils('FRUEmailUtils');
    },
    inboundCondition: function(_email, _property) {
        var disableCondition = gs.getProperty("custom.incident.incident_email_disable");
        if (disableCondition == "true") {
            return true;
        }
        var emailto;
        if (_email.subject.toLowerCase().indexOf("fw:") != 0 && _email.subject.toLowerCase().indexOf("fwd:") != 0)
            emailto = _email.direct.split(','); //To use for redirected emails emails
        else
            emailto = _email.from.split(','); //To use for forwarded emails

        var result = false;
        this.dbg.FRUDebug('inboundCondition: Processing recipients To: ' + emailto + ' and CC: ' + _email.copied + ' against property list ' + _property);
        if (JSUtil.nil(emailto) || JSUtil.nil(_property)) {
            this.dbg.FRUDebug('inboundCondition: Recipients or Property content missing. Exiting');
            return false;
        }
        //Check emailto first and return true if found
        this.dbg.FRUDebug('inboundCondition: Recipients type ' + typeof emailto + ' length ' + emailto.length);
        if (emailto.length > 1) {
            this.dbg.FRUDebug('inboundCondition: Checking Multiple Recipients');
            result = this.checkMultipleRecipients(emailto, _property);
            //return false;
            //this.processMultiple(recipients);
        } else {
            this.dbg.FRUDebug('inboundCondition: Checking Single Recipient');
            result = this.checkSingleRecipient(emailto, _property);
            //var recipient = recipients[0];
        }
        this.dbg.FRUDebug('inboundCondition: Checking To: returned ' + result);
        if (result == true) {
            this.dbg.FRUDebug('inboundCondition: Match found To:');
            return true;
        } else {
            //Check CC
            if (JSUtil.notNil(_email.copied)) {
                var emailcc = _email.copied.split(',');
                this.dbg.FRUDebug('inboundCondition: Checking CC - Recipients type ' + typeof emailcc + ' length ' + emailcc.length);
                if (emailcc.length > 1) {
                    this.dbg.FRUDebug('inboundCondition: Multiple Recipients found');
                    result = this.checkMultipleRecipients(emailcc, _property);
                } else {
                    this.dbg.FRUDebug('inboundCondition: Single Recipient found');
                    result = this.checkSingleRecipient(emailcc, _property);

                }
                if (result == true) {
                    this.dbg.FRUDebug('inboundCondition: Match found ');
                    return true;
                } else {
                    this.dbg.FRUDebug('inboundCondition: Match not found for To:');
                    return false;

                }
            }
            return result;
        }
        //this.processSingle(recipient);
    },
    checkSingleRecipient: function(_recipient, _property) {
        this.dbg.FRUDebug('checkSingleRecipient: Checking Single Recipient from ' + _recipient + ' using property list ' + _property);
        var recipient = "";
        if (typeof _recipient == 'object')
            recipient = _recipient[0];
        else
            recipient = _recipient;


        if (_property.toLowerCase().indexOf(recipient.toLowerCase()) > -1) {
            this.dbg.FRUDebug('checkSingleRecipient: Match found ');
            return true;
        }
        this.dbg.FRUDebug('checkSingleRecipient: No match found');
        return false;

    },
    checkMultipleRecipients: function(_recipients, _property) {
        var emaillist = [];
        if (typeof _recipients == 'object') {
            emaillist = _recipients;
        } else {
            emaillist = _recipients.split(',');
        }

        this.dbg.FRUDebug('checkMultipleRecipients: Checking Multiple Recipients from ' + emaillist + ' using property list ' + _property);
        for (var a = 0; a < emaillist.length; a++) {
            this.dbg.FRUDebug('checkMulitpleRecipients: Processing recipient ' + emaillist[a] + ' using property list ' + _property);
            if (_property.toLowerCase().indexOf(emaillist[a].toString().toLowerCase()) > -1) {
                this.dbg.FRUDebug('checkMulitpleRecipients: Match found ');
                return true;
            }
        }
        this.dbg.FRUDebug('checkMulitpleRecipients: No match found');
        return false;

    },
    checkReplyAddress: function(_current) {
        this.dbg.FRUDebug('checkReplyAddress: Checking From/Reply to address for group ' + _current.assignment_group.name);
        if (JSUtil.notNil(_current.assignment_group)) {
            if (JSUtil.notNil(_current.assignment_group.u_from_email_address)) {
                this.dbg.FRUDebug('checkReplyAddress: From/Reply to address found');
                return true;
            } else {
                this.dbg.FRUDebug('checkReplyAddress: From/Reply to address not found');
                return false;
            }

        }
        this.dbg.FRUDebug('checkReplyAddress: No Assignment Group found');
        return false;

    },
    getReplyAddress: function(_current) {
        this.dbg.FRUDebug('getReplyAddress: Checking From/Reply to address for table ' + _current.sys_class_name);
        if (JSUtil.notNil(_current.sys_class_name)) {
            var classname = String(_current.sys_class_name);
            var property = gs.getProperty('custom.' + classname + '.replyto_email');
            if (JSUtil.notNil(property)) {
                this.dbg.FRUDebug('getReplyAddress: From/Reply to address found as: ' + property);
                return property;
            } else {
                this.dbg.FRUDebug('getReplyAddress: From/Reply to address not found');
                return "";
            }

        }
    },
    isAuthorised: function(_email) {
        var testSubject = this.AuthoriseSubject(_email);
        var testEmail = this.AuthoriseEmail(_email);

        if (testSubject == true && testEmail == true) {
            return true;
            // Email authorised, create incident
        } else {
            return false;
            // Email not authorised, incident not created       
        }

    },
    AuthoriseSubject: function(_email) {
        var _keySubjects = gs.getProperty("custom.incident.keyword.exclusion.subject");
        var disableCondition = gs.getProperty("custom.incident.incident_email_disable");
        // gs.log("incoming email subject " + _email.subject, label);
        // gs.log("subject keywords " + _keySubjects, label);

        var keySubjectList = [];

        keySubjectList = _keySubjects.split(',');
        // gs.log("keySubjectList is split as " + keySubjectList, label);

        var emailSubject = _email.subject;
        for (var a = 0; a < keySubjectList.length; a++) {
            //gs.log("In the for loop", label);
            //gs.log("value of " + a + "for loop is "+ keySubjectList[a], label);
            if (emailSubject.toLowerCase().indexOf(keySubjectList[a].toString().toLowerCase()) != -1) {
                //gs.log("Match found, for " + keySubjectList[a] + " Do not create incident ", label);
                gs.log("Auth Subject return false", label);
                return false;
                //false to NOT create incident 
            }
        }
        return true;
    },
    AuthoriseEmail: function(_email) {
        var _keyAddresses = gs.getProperty("custom.incident.keyword.exclusion.emails");
        this.dbg.FRUDebug('inboundCondition: Checking _email subject and _email direct to see if they match with any key words from' + _keyAddresses);

        var keyEmailList = [];

        keyEmailList = _keyAddresses.split(',');

        var emailAddress = _email.from;
        for (var a = 0; a < keyEmailList.length; a++) {
            //gs.log("In the for loop", label);
            //gs.log("value of " + a + "for loop is "+ keySubjectList[a], label);
            if (emailAddress.toLowerCase().indexOf(keyEmailList[a].toString().toLowerCase()) != -1) {
                //gs.log("Match found, for " + keySubjectList[a] + " Do not create incident ", label);
                gs.log("Auth Email return false", label);
                return false;
                //false to NOT create incident 
            }

        }
        return true;
    },

    AuthoriseRangeSDEmail: function(_email) {

        var emailAddress = '';
        if (JSUtil.notNil(_email.from)) {
            emailAddress += _email.from;
        }
        if (JSUtil.notNil(_email.direct)) {
            emailAddress += _email.direct;
        }
        if (JSUtil.notNil(_email.to)) {
            emailAddress += _email.to;
        }
        //this.dbg.FRUDebug('From: ' + emailAddress);
        emailAddress = emailAddress.toLowerCase();
        var checkForEmlAdd = ('RangeServiceDesk@Raytheon.com.au').toLowerCase();
        if (JSUtil.notNil(emailAddress)) {

            this.dbg.FRUDebug('AuthoriseRangeSDEmail: indexOf(' + checkForEmlAdd + ')' + emailAddress.toLowerCase().indexOf(checkForEmlAdd));
            if (emailAddress.indexOf(checkForEmlAdd) == '-1') {
                this.dbg.FRUDebug('AuthoriseRangeSDEmail: Auth Email return false');
                return false;
            }
        }

        return true;
    },

    AuthoriseAlseFwdEmail: function(_email) {

        var emailAddress = '';
        if (JSUtil.notNil(_email.from)) {
            emailAddress += _email.from;
        }
        if (JSUtil.notNil(_email.direct)) {
            emailAddress += _email.direct;
        }
        if (JSUtil.notNil(_email.to)) {
            emailAddress += _email.to;
        }
        //this.dbg.FRUDebug('From: ' + emailAddress);
        emailAddress = emailAddress.toLowerCase();
        var checkForEmlAdd = ('alse@raytheon.com.au').toLowerCase();
        if (JSUtil.notNil(emailAddress)) {

            this.dbg.FRUDebug('AuthoriseRangeSDEmail: indexOf(' + checkForEmlAdd + ')' + emailAddress.toLowerCase().indexOf(checkForEmlAdd));
            if (emailAddress.indexOf(checkForEmlAdd) == '-1') {
                this.dbg.FRUDebug('AuthoriseRangeSDEmail: Auth Email return false');
                return false;
            }
        }

        return true;
    },

    type: 'FRUEmailUtils'
};