function onChange(control, oldValue, newValue, isLoading) {
   if (isLoading || newValue == '') {
      return;
   }

   //Type appropriate comment here, and begin script below
	
	var wbsID = newValue;
	
	var ga = new GlideAjax('EVTUtilsAjax');
	ga.addParam("sysparm_name", "getWBSData");
	ga.addParam("sysparm_wbs", wbsID);
	ga.getXML(getResponse);
   
}

function getResponse(response) {
	
	var answer = response.responseXML.documentElement.getAttribute('answer');
		
	//alert('Provided response is: ' + answer);
	
	try{
	
		var responseObj = JSON.parse(answer);

		//alert('Response Length is: ' + responseObj.length);
		//alert(responseObj);
		
		var allFormFields = g_form.getFieldNames();

		for (i=0; i <= answer.length; i++){
			
			if (responseObj[i]){
				
				var fieldName = responseObj[i].fieldName;
				var fieldVal = responseObj[i].fieldValue;
				
				g_form.clearValue(fieldName);
			
				if (fieldVal != null){
					g_form.setValue(fieldName, fieldVal);
				}
			} 
		}
	}
	catch(err){
		alert('Error Found when Populating Data: ' + err);
	}
}
