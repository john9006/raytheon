function runClientCode() {
    g_form.setMandatory('u_parent', true);
    g_form.setValue('u_root_wbs', false);
    gsftSubmit(null, g_form.getFormElement(), 'unset_as_root_wbs');
}
if (typeof window == 'undefined') {
    runServerCode();
}

function runServerCode() {
	current.setValue('u_root_wbs', false);
	current.update();
	
	action.setRedirectURL(current);
	
}
