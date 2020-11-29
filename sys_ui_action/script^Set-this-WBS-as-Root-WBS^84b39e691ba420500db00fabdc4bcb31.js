function runClientCode() {
    g_form.setMandatory('u_parent', false);
    g_form.setValue('u_root_wbs', true);
    gsftSubmit(null, g_form.getFormElement(), 'set_as_root_wbs');
}
if (typeof window == 'undefined') {
    runServerCode();
}

function runServerCode() {
	current.u_root_wbs = true;
	current.update();
	
}