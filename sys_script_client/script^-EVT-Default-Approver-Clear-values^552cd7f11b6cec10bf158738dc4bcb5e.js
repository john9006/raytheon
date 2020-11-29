function onChange(control, oldValue, newValue, isLoading, isTemplate) {
    if (isLoading) {
        return;
    }
    g_form.clearMessages();
    g_form.clearValue('u_role_descriptor');
    g_form.clearValue('u_level');
    g_form.clearValue('u_type');

}