// this function is called client side
function confirmAndCancel() {

    // check to see if we need to confirm this action with the user
    var seekConfirmation = g_scratchpad.seek_confirm_change;
    if (seekConfirmation != undefined) {
        if (seekConfirmation == 'true') {
            if (!confirm('Are you sure that you wish to cancel this change? Note: this action is irreversible')) {
                return false;
            }
        }
    }

    if (g_form.getValue('close_notes') == '') {
        alert('You must provide a closure comment to Cancel this Change Request.');
        return false;
    }

    gsftSubmit(null, g_form.getFormElement(), 'cancel_rfc');
}

if (typeof window == 'undefined') {

    // this is the server side part of the script
    current.state = 7; //Closed
    current.close_code = 'Cancelled';
    current.approval = 'not requested';
    current.update();

    // set approvals to no longer required
    new UIActionUtils().approvalsNoLongerRequired(current.sys_id);

    // cancel any running workflows.
    new Workflow().cancel(current);
}