function onChange(control, oldValue, newValue, isLoading, isTemplate) {
    if (isLoading || newValue === '') {
        return;
    }		
    if (newValue == 'cam') {
        var type = g_form.getValue('u_type');
        if (type == '') {
            g_form.setValue('u_type', 'RWP,Replan Minor,Replan Major,SWA');
            g_form.setValue('u_level', 1);
        }
    }
}