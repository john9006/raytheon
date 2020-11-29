function onChange(control, oldValue, newValue, isLoading) {
   if (isLoading || newValue == '') {
      return;
   }

   //Type appropriate comment here, and begin script below
	var wbsProgram = g_form.getValue('wbs_program');
	var prevWbsVal = oldValue;
	var wbsNumVal = newValue;
	var isUpdate = 'false';
	
	if (g_form.getValue('create_or_update') == 'update'){
		isUpdate = 'true';
	}
	
	if (isUpdate == 'true'){
		var updateRecID = g_form.getValue('wbs_to_update');			
	}
	
	var ga = new GlideAjax('EVTUtilsAjax');
	ga.addParam("sysparm_name", "checkWBSNumberValidity");
	ga.addParam("wbsProgram", wbsProgram);
	ga.addParam("isUpdate", isUpdate);
	ga.addParam("wbsNumVal", wbsNumVal);
	ga.addParam("updateRecID", updateRecID);
	ga.getXML(getResponse);	
		
	function getResponse(response) {
	
		var answer = response.responseXML.documentElement.getAttribute('answer');
		var responseString = JSON.parse(answer);
	
		//alert('Analysis of whether number is valid: ' + responseString);
		
		if (isUpdate == 'true' && responseString == false){
			
			var gr = new GlideRecord('u_evt_wbs');
			gr.addQuery('sys_id', updateRecID);
			gr.query(grUpdateResponse);
		
		}
		else if (isUpdate == 'false' && responseString == false){
			g_form.setValue('u_wbs_number', '');
			g_form.showFieldMsg('u_wbs_number', 'The WBS Number you entered already exists for the selected program, please enter a unique WBS number, or reload the form and update an existing WBS record if required.', 'error');
		}
		else{
			g_form.clearMessages();
		}	
	}	  
}

function grUpdateResponse(gr){
	while (gr.next()){
		var updateRecNum = gr.u_wbs_number;
		g_form.setValue('u_wbs_number', updateRecNum);
		g_form.showFieldMsg('u_wbs_number', 'The WBS Number cannot be changed for an existing WBS Record using this form. If this is required, please contact an administrator.', 'error');
		
	}
}
