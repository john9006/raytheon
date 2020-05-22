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

	/* function to return advanced qualifier to constrain the seclected TTRs to those with the
	   Program specified by the user in a previous field

	*/

	filterOnProgram: function(program){
		return 'u_program!=NULL^u_program=' + program + '^u_approvalINapproved,expired';

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