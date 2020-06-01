var EXIMTTRHelper = Class.create();

EXIMTTRHelper.prototype = {
    initialize: function() {
    },

	/*
	Function to check the Approval Expiry for an EXIM Transfer Request has not expired, and is within 7 days from now.
	Used in the 'Renew Transfer Request' UI Action to conditionally display only when approval expires in the next 7 days.
	*/

	checkRenewal: function(approvalExpiry){
		// Set Result to 'False'
		var result = 'false';

		// Get All Dates as GlideDates to ensure compatibility with different timezones and formats
		var expiryDate = new GlideDateTime(approvalExpiry);

		//Create a second glideDate record to get our 'target date'
		var expiryGD = new GlideDateTime(expiryDate);
		expiryGD.addDaysUTC(-7);

		//get Current dateTime then convert to GlideDateTime object
		var currentDateTime = gs.nowDateTime();
		var dt = new GlideDateTime(currentDateTime);

		// Check that expiry date is after today, and that the 'target date' is less than or equal to today (i.e. record is within 7 days of expiry)
		if (expiryDate >= dt && expiryGD <= dt){

			//If record is within 7 days of expiry, set result to 'true'
			result = 'true';

		}

		return result;
	},
	
	/** 
	
	Function to check the current list of Exim Ops assessments related to a particular EXIM Task, and return 'True' if either of the following apply:
	1. No assessments exist relating to the current task
	2. All related assessments are in a 'Passed' or 'Failed' state
	
	Otherwise script will return false
	
	**/
	
	checkAssessmentCompletion: function(extskID){
		
		var taskID = extskID;
		var hasAssessments = false;
		var hasPendingAssessments = false;
		var openCount = 0;
				
		var asmtGr = new GlideRecord('u_exim_ops_assessment');
		asmtGr.addQuery('u_parent_task', taskID);
		asmtGr.query();
		
		while (asmtGr.next()){
			hasAssessments = true;
			
			if (asmtGr.u_assessment_outcome == 'Pending'){
				hasPendingAssessments = true;
				openCount++;
			}	
		}
		
		gs.log('Has Assessments? = ' + hasAssessments);
		gs.log('Has Pending Assessments? = ' + hasPendingAssessments);
		gs.log('Open Assessment Count: ' + openCount);
		
		if (hasAssessments == false || (hasAssessments == true && hasPendingAssessments == false)){
			return true;
		}
		else{
			return false;
		}
		
	},
	

	/* function to return advanced qualifier to constrain the seclected TTRs to those with the
	   Program specified by the user in a previous field

	*/

	filterOnProgram: function(program){
		return 'u_program!=NULL^u_program=' + program + '^u_approvalINapproved,expired';

	},
	filterOnProgramExclAus: function(program){
		return 'u_program!=NULL^u_program=' + program + '^u_approvalINapproved,expired' + '^u_source_country.name!=Australia';

	},
	
	filterAuthCompanies: function(agreements){
		
		var filterString = '';
		
		if (agreements.toString() == ''){
			return 'u_exim_agreement=undefined';
		}
		
		var eaArr = [];
		eaArr = agreements.toString().split(',');
		eaArr = new ArrayUtil().unique(eaArr);
		
		var arrLength = eaArr.length;
		
		if (arrLength == 1){
			filterString = 'u_exim_agreement=' + eaArr[0];
		}
		else if (arrLength >= 2){
			
			for (var i = 0; i < arrLength; i++){
				if (i == 0){
					filterString = 'u_exim_agreement=' + eaArr[i];
				}
				else{
					filterString = filterString + '^ORu_exim_agreement=' + eaArr[i];
				}
			}
			
		}		
		
		return filterString;

	},
	
    type: 'EXIMTTRHelper'
};