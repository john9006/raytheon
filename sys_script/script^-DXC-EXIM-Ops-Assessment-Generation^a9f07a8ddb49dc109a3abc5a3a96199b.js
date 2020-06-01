(function executeRule(current, previous /*null when async*/) {

// Capture the Task ID, Type and Transfer Request values

var taskID = current.sys_id;
var taskType = current.u_type;
var TransferReqID = current.u_transfer_request;


// Validate that the Task Type is Technology Transfer Request and that the Transfer Request field is not empty.

if (taskType == 'ttr' && TransferReqID != ''){

	// Create a GlideRecord object with the Transfer Request sys_id

	var ttrGr = new GlideRecord('u_exim_transfer_request');
	ttrGr.addQuery('sys_id', TransferReqID);
	ttrGr.query();

	while (ttrGr.next()){

		// Capture Transfer Request values as variables for quick access later.

		var ttrType = ttrGr.u_cttr_type;
		var ttrProgram = ttrGr.u_exim_program;
		var eaMissing = ttrGr.u_agreement_missing;
		var alternateRecipient = ttrGr.u_alternate_recipient;
		var ttrECCN = ttrGr.u_applicable_us_ea_eccn;
		var eaList = ttrGr.u_applicable_agreements.toString();
		var asmtGr;
		
		// Ensure EA List is not empty.
		if (eaList != '' && eaList != 'NULL'){

			//Create string variable to capture the encoded query for EAs
			var eaEncQuery = 'sys_idIN' + eaList;
			
			// Create GlideRecord query to loop through agreement records.
			var eaGr = new GlideRecord('u_exim_agreement');
			eaGr.addEncodedQuery(eaEncQuery);
			eaGr.query();

			while (eaGr.next()){

				var eaID = eaGr.sys_id;
				var eaSource = eaGr.u_source_country;

				// Check if Source Country is 'United States of America'
				if (eaSource == 'dd38b7111b121100763d91eebc0713f5'){

					var eaType = eaGr.u_ea_type;

					// Check if EA Type requires a 'US Controlled Technology' Assessment
					if (eaType == 'TAA' || eaType == 'TPTA FMS' || eaType == 'MLA' || eaType == 'TPTA DCS' || eaType == 'DSP-5' || eaType == 'DSP-73' || eaType == 'DSP-85' || eaType == 'MoU' || eaType == 'Export Licence'){

						
						// Create an Exim Ops Assessment Record of type 'US Controlled Technology'
						var USasmtGr = new GlideRecord('u_exim_ops_assessment');
						USasmtGr.initialize();
						USasmtGr.u_parent_task = taskID;
						USasmtGr.u_process = 'CTTR';
						USasmtGr.u_transfer_request = TransferReqID;
						USasmtGr.u_assessment_type = 'US Controlled Technology';
						USasmtGr.u_exim_agreement = eaID;
						USasmtGr.u_auto_generated = 'true';
						USasmtGr.insert();

					}
				}

				/** Check if EA Source Country is NOT 'Australia' or 'United States of America'
				If so, generate a 'Non-US Controlled Technology' assessment record **/
				
				if (eaSource != 'dd38b7111b121100763d91eebc0713f5' && eaSource != '9138b7111b121100763d91eebc0713f6'){

					// Create an Exim Ops Assessment Record of type 'Non-US Controlled Technology'
					var NUSasmtGr = new GlideRecord('u_exim_ops_assessment');
					NUSasmtGr.initialize();
					NUSasmtGr.u_parent_task = taskID;
					NUSasmtGr.u_process = 'CTTR';
					NUSasmtGr.u_transfer_request = TransferReqID;
					NUSasmtGr.u_assessment_type = 'Non-US Controlled Technology';
					NUSasmtGr.u_exim_agreement = eaID;
					NUSasmtGr.u_auto_generated = 'true';
					NUSasmtGr.u_ea_source_country = eaSource;
					NUSasmtGr.insert();

				}


			}

		}

		// Check if EA Missing checkbox is Populated, and if so, generate an assessment record.
		if (eaMissing == true){

			// Create an Exim Ops Assessment Record of type 'Unlisted Export Authorisation'
			var EAMasmtGr = new GlideRecord('u_exim_ops_assessment');
			EAMasmtGr.initialize();
			EAMasmtGr.u_parent_task = taskID;
			EAMasmtGr.u_process = 'CTTR';
			EAMasmtGr.u_transfer_request = TransferReqID;
			EAMasmtGr.u_assessment_type = 'Unlisted Export Authorisation';
			EAMasmtGr.u_auto_generated = 'true';
			EAMasmtGr.insert();
			
		}
		
		// Check if US EA ECCN is Populated, and if so, generate an assessment record.
		if (ttrECCN != '' && ttrECCN != 'NULL'){

			// Create an Exim Ops Assessment Record of type 'US EAR Controlled Technology'
			var EARasmtGr = new GlideRecord('u_exim_ops_assessment');
			EARasmtGr.initialize();
			EARasmtGr.u_parent_task = taskID;
			EARasmtGr.u_process = 'CTTR';
			EARasmtGr.u_transfer_request = TransferReqID;
			EARasmtGr.u_assessment_type = 'US EAR Controlled Technology';
			EARasmtGr.u_auto_generated = 'true';
			EARasmtGr.insert();
			
		}
		

		// Create a variable to capture the country of the intended recipient
		var targetCountry = '';

		// Check if an Alternate Recipient was supplied, or whether an authorised company was selected.
		if (alternateRecipient == false){
			targetCountry = ttrGr.u_authorised_recipient.u_exim_company.u_company_country;
		}
		else {
			targetCountry = ttrGr.u_recipient_country;
		}

		// Check if target country is NOT Australia, and generate relevant assessments.
		if (targetCountry != '9138b7111b121100763d91eebc0713f6'){

			// Check if any of the 'Tangible' methods of transfer were selected and generate relevant assessment.
			if (ttrGr.u_site_visit == true || ttrGr.u_hand_carry == true || ttrGr.u_standard_post_transfer == true || ttrGr.u_courier_transfer == true || ttrGr.u_air_sea_freight == true || ttrGr.u_other_transfer_method == true){

				// Create an Exim Ops Assessment Record of type 'Australian DSGL Controlled Technology - Tangible'
				var DSGLTasmtGr = new GlideRecord('u_exim_ops_assessment');
			
				DSGLTasmtGr.initialize();
				DSGLTasmtGr.u_parent_task = taskID;
				DSGLTasmtGr.u_process = 'CTTR';
				DSGLTasmtGr.u_transfer_request = TransferReqID;
				DSGLTasmtGr.u_assessment_type = 'Australian DSGL Controlled Technology - Tangible';
				DSGLTasmtGr.u_auto_generated = 'true';
				DSGLTasmtGr.insert();

			}

			// Check if any of the 'Intangible' methods of transfer were selected and generate relevant assessment.
			if (ttrGr.u_encrypted_email_transfer == true || ttrGr.u_oral_transfer == true || ttrGr.u_upload_to_docushare == true || ttrGr.u_data_portal_upload == true || ttrGr.u_other_transfer_method == true){

				// Create an Exim Ops Assessment Record of type 'Australian DSGL Controlled Technology - Intangible'
				var DSGLIasmtGr = new GlideRecord('u_exim_ops_assessment');
			
				DSGLIasmtGr.initialize();
				DSGLIasmtGr.u_parent_task = taskID;
				DSGLIasmtGr.u_process = 'CTTR';
				DSGLIasmtGr.u_transfer_request = TransferReqID;
				DSGLIasmtGr.u_assessment_type = 'Australian DSGL Controlled Technology - Intangible';
				DSGLIasmtGr.u_auto_generated = 'true';
				DSGLIasmtGr.insert();

			}

			// Finally, always generate a single 'Restricted Party Screening' Assessment Record for a TTR
			var RPSasmtGr = new GlideRecord('u_exim_ops_assessment');

			RPSasmtGr.initialize();
			RPSasmtGr.u_parent_task = taskID;
			RPSasmtGr.u_process = 'CTTR';
			RPSasmtGr.u_transfer_request = TransferReqID;
			RPSasmtGr.u_assessment_type = 'Restricted Party Screening';
			RPSasmtGr.u_auto_generated = 'true';
			RPSasmtGr.insert();
			

		}

	}	

}

})(current, previous);