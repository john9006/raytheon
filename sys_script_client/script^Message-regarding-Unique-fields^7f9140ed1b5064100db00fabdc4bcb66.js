function onChange(control, oldValue, newValue, isLoading, isTemplate) {
   if (isLoading || newValue === '') {
      return;
   }

  if(g_form.isNewRecord()){
      g_form.showFieldMsg('u_id','Please note that the Program/Type/ID must be a unique combination to be successfully saved');
   }
   
}