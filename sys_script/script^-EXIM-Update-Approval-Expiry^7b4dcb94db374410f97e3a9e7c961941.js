(function executeRule(current, previous /*null when async*/ ) {

    // Find most recent Approval Date, and the Required To date
    var approvalDate = new GlideDateTime(current.u_approval_date);
    var requiredDate = new GlideDateTime(current.u_required_to_date);
    var existingExpiry = new GlideDateTime(current.u_approval_expiry);
    //gs.log('>>>Existing Expiry value is : ' + existingExpiry + ' Approval Date is ' + approvalDate + ' Required Date is ' + requiredDate);

    var gDate1 = new GlideDateTime();

    if (existingExpiry == '' || existingExpiry == undefined) {

        gDate1.setValue(approvalDate);

        // Add 30 Days to the current Approval Date
        gDate1.addDaysUTC(30);

    } else {
        gDate1.setValue(existingExpiry);

        // Add 30 Days to the current Approval Expiry Date
        gDate1.addDaysUTC(30);

    }

    var expiryDate = new GlideDateTime(gDate1);

    // Check if 30 Days from last approval date is lower than the 'required to' date, if not, set approval expiry to the 'Required to' date.
    if (requiredDate == '' || requiredDate == undefined) {
        current.u_approval_expiry = expiryDate.getLocalDate();
    } else {
        if (expiryDate <= requiredDate) {
            current.u_approval_expiry = expiryDate.getLocalDate();
        } else if (expiryDate > requiredDate) {
            current.u_approval_expiry = requiredDate.getLocalDate();
        }
    }


})(current, previous);