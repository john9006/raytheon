function onChange(control, oldValue, newValue, isLoading, isTemplate) {
    if (isLoading || newValue === '') {
        return;
    }
    var message = '';
    if (newValue != '') {  // there is a CCP
        var subType = g_form.getValue('u_sub_type');
        var type = g_form.getValue('u_type');

        if (type != 'Replan Major') {
            g_form.setValue('u_type', 'Replan Major');
            message = 'Because you have a CCP the Type must be "Replan Major".';
        }
        if (subType.indexOf('CCP') < 0) {
            // Does not include CCP
            message += ' This sub type field must be either "CCP" or "Both CCP and MR"';
        }
		if (message > '') {
			g_form.showFieldMsg('u_sub_type', message, 'info');
		}
    }

}