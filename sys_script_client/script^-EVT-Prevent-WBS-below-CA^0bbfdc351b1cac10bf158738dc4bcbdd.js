function onChange(control, oldValue, newValue, isLoading, isTemplate) {
    if (isLoading || newValue === '') {
        return;
    }

    // u_parent.u_control_account'
    var ga = new GlideAjax('SmartAjaxReferenceLookup');
    ga.addParam('sysparm_name', 'ajaxClientDataHandler');

    //Add new parameters for our new GlideAjax Class
    ga.addParam('sysparm_tablename', 'u_evt_wbs'); //Table name
    ga.addParam('sysparm_sysid', newValue); //newValue
    ga.addParam('sysparm_fieldnames', 'u_control_account,u_title,u_wbs_number'); //Field name we want to retrieve
    ga.getXML(myCallback);
}

function myCallback(response) {
    var answer = response.responseXML.documentElement.getAttribute("answer");
    //g_form.addInfoMessage('the returned vals are ' + answer);
    answer = JSON.parse(answer);
    useFieldValues(answer);
}

function useFieldValues(data) { //returns only the values we need   

    if (data.u_control_account.displayValue == 'true') {
        g_form.showFieldMsg('u_parent', 'The parent is a Control Account and can not be the parent to ' + g_form.getValue('u_wbs_number'));
    }
    setTimeout(function() {
        g_form.setValue('u_parent', '');
    }, 5000);

}