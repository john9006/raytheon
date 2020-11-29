function onChange(control, oldValue, newValue, isLoading) {
   if (isLoading || newValue == '') {
      return;
   }

   //Type appropriate comment here, and begin script below
	
	var wbsID = g_form.getValue('select_wbs');
	
	var ga = new GlideAjax('EVTUtilsAjax');
	ga.addParam("sysparm_name", "getWBSData");
	ga.addParam("sysparm_wbs", wbsID);
	ga.getXML(getResponse);
   
}

function getResponse(response) {
	
	var json = new JSON();
	var answer = response.responseXML.documentElement.getAttribute('answer');
	
	var responseObj = json.parse('answer');
	
	alert(answer.length);
	alert(responseObj[0]);
	
	for (i=0; i < answer.length; i++){
		//do something
	}
	
}
