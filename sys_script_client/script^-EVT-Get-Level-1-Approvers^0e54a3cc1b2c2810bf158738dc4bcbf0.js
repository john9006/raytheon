function onChange(control, oldValue, newValue, isLoading, isTemplate) {
    if (isLoading || newValue === '') {
        return;
    }
    var recType;
    if (g_form.getValue('u_type') == 'BCR') {
        recType = g_form.getValue('u_bcr_type'); //subType for BCR
    }
    if (g_form.getValue('u_type') == 'SWA') {
        recType = 'SWA';
    }

 var gajax = new GlideAjax('global.EVTUtilsAjax');
    gajax.addParam('sysparm_name', 'getDefaultApprovers');
    gajax.addParam('sysparm_project', g_form.getValue('u_project'));
	gajax.addParam('sysparm_level', '1');
	gajax.addParam('sysparm_recType', recType);
   
    gajax.getXML(ajax_response);

    function ajax_response(response) {
        var answer = response.responseXML.documentElement.getAttribute("answer");
		//g_form.addInfoMessage('the answer is ' + answer);
		g_form.setValue('u_level_1_approver',answer);
    }


}