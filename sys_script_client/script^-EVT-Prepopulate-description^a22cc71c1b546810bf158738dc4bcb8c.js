function onChange(control, oldValue, newValue, isLoading, isTemplate) {
    if (isLoading || newValue === '') {
        return;
    }
    var ga = new GlideAjax('SmartAjaxReferenceLookup');
    ga.addParam('sysparm_name', 'ajaxClientDataHandler');

    //Add new parameters for our new GlideAjax Class
    ga.addParam('sysparm_tablename', 'u_evt_wbs'); //Table name
    ga.addParam('sysparm_sysid', newValue); //newValue
    ga.addParam('sysparm_fieldnames', 'u_description'); //Field name we want to retrieve
    ga.getXML(myCallback);
}

function myCallback(response) {
    var answer = response.responseXML.documentElement.getAttribute("answer");
    answer = JSON.parse(answer);
    setFieldValues(answer);
}

function setFieldValues(data) { //returns only the values we need

    if (data) {
        var desc = g_form.getValue('u_description');
        if (desc == '') {
            g_form.setValue('u_description', data.u_description.value, data.u_description.displayValue); //set value to avoid round-trip             
        }
        var title = g_form.getValue('u_title');
        if (title == '') {
            g_form.setValue('u_title', data.u_description.value, data.u_description.displayValue); // set it to desc from wbs
        }
    }
}