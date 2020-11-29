function onChange(control, oldValue, newValue, isLoading) {
    if (isLoading || newValue == '') {
        return;
    }
	var managementReserve;
	validateDollar(newValue);	

    function validateDollar(managementReserve) {
        if (!/^(\d+|\d{1,3}(,\d{3})*)(\.\d{1,2})?$/.test(managementReserve)) {
            g_form.showFieldMsg("u_mr_impact", "Must enter a valid dollar amount (cents are optional)", "error");
           
        }
	}
}