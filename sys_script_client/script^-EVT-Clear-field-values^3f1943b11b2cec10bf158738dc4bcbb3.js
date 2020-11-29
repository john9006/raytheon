function onChange(control, oldValue, newValue, isLoading, isTemplate) {
   if (isLoading ) {
      return;
   }
	g_form.clearMessages();	
	g_form.clearValue('u_id');
	g_form.clearValue('u_description');
	g_form.clearValue('u_revision');
	g_form.clearValue('u_ccp_state');
	g_form.clearValue('u_ccp_executed_date');
	g_form.clearValue('u_ccp_value');
	g_form.clearValue('u_obs_manager'); 
   
}