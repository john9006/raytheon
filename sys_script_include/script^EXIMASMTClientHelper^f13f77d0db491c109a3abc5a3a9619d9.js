var EXIMASMTClientHelper = Class.create();
EXIMASMTClientHelper.prototype = Object.extendsObject(AbstractAjaxProcessor, {
	
	// Function to return the 'Estimated CTTR Expiry Date', which is 30 days from the current date
	
	getEstimatedExpiry: function(){
		
		var estDate;
		
		// Get current Date
		var nowDate = new GlideDate(); 
		
		// Create GlideDate for Future Date
		var futureGDT = new GlideDateTime(nowDate);
		futureGDT.addDaysUTC(30);
		var futureDate = futureGDT.getLocalDate();
		var futureGD = new GlideDate();
		futureGD.setValue(futureDate);
		estDate = futureGD.getByFormat("dd/MM/yyyy");
		
		return estDate.toString();
		
	},
	
	checkExpiryValidity: function(eaID, cttrExpiry){
		
		// Get Parameters and store as variables
		var eaSysID = this.getParameter('eaID');
		var transferExpiry = this.getParameter('cttrExpiry');
		
		// Create EA Expiry variable and use GlideRecord to populate based on provided ID
		var eaExpiry = '';
		var eaGr = new GlideRecord('u_exim_agreement');
		eaGr.addQuery('sys_id', eaSysID);
		eaGr.query();
		
		while (eaGr.next()){
			eaExpiry = eaGr.u_expiry_date;
		}
		
		// Create GlideDate Records to set the values, EA Expiry Value will be UTC, CTTR Expiry Value will be in users time-zone
		var eaGD = new GlideDate();
		eaGD.setValue(eaExpiry);
		var cttrGD = new GlideDate();
		cttrGD.setDisplayValue(transferExpiry);
		
		// Create GlideDateTime objects and set values to the GlideDate values
		var eaGDT = new GlideDateTime(eaGD);
		var cttrGDT = new GlideDateTime(cttrGD);
		
		
		// Check if the EA Expiry GlideDateTime is 'before', 'equal to', or 'after' the CTTR Expiry GlideDateTime and return relevant result.
		if (eaGDT.before(cttrGDT)){
			return 'false';
		}
		else if (eaGDT.equals(cttrGDT)){
			return 'equal';
		}
		else if (eaGDT.after(cttrGDT)){
			return 'true';
		}
		
		
	},
	
	// Function to retreive the TTR associated with an EXIM Task Record
	
	getTransferRequest: function(parentTask){
		
		// Get Parameter and store as variables
		var parentID = this.getParameter('parentTask');
		var requestID = '';
		
		var gr = new GlideRecord('u_exim_task');
		gr.addQuery('sys_id', parentID);
		gr.query();
		
		while (gr.next()){
			requestID = gr.u_transfer_request;
		}
		
		return requestID.toString();
		
	},
	
	// Function to retreive the value of the Missing Agreement Details field from a specified Transfer Request if reuqired by client scripts
	
	getUnlistedEAs: function(transferReq){
		
		var unlistedEAs = '';
		var ttrGR = new GlideRecord('u_exim_transfer_request');
		ttrGR.addQuery('sys_id', transferReq);
		ttrGR.query();
		while (ttrGR.next()){
			unlistedEAs = ttrGR.u_missing_agreement_details;
		}
		
		return unlistedEAs.toString();
		
	},
	
	// Functions to retreive the program values of a selected TTR or EA in an assessment record, for use in client scripts as needed
	
	
	getTTRProgram: function(transferReq){
		
		var ttrProgram = '';
		var ttrGR = new GlideRecord('u_exim_transfer_request');
		ttrGR.addQuery('sys_id', transferReq);
		ttrGR.query();
		while (ttrGR.next()){
			ttrProgram = ttrGR.u_exim_program;
		}
		
		return ttrProgram.toString();
	
		
	},
	
	getEAPrograms: function(agreement){
		
		var eaPrograms = '';
		var eaGR = new GlideRecord('u_exim_agreement');
		eaGR.addQuery('sys_id', agreement);
		eaGR.query();
		while (eaGR.next()){
			eaPrograms = eaGR.u_program;
		}
		
		return eaPrograms.toString();
	
		
	},

    type: 'EXIMASMTClientHelper'
});