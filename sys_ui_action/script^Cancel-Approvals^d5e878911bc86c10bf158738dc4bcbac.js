function confirmAndCancel() {

    // check to see if we need to confirm this action with the user

    if (!confirm('Are you sure that you wish to Cancel this EVT Task? Note: this action is irreversible')) {
        return false;
    }
    gsftSubmit(null, g_form.getFormElement(), 'u_evt_approvals_cancel');
}

if (typeof window == 'undefined') {
    runServerCode();
}

function runServerCode() {
    try {
        var closedIncomplete = 4;
        current.setValue('approval', 'cancelled');
        current.setValue('state', closedIncomplete); // closed incomplete
        current.work_notes = 'Task has been cancelled through the use of the form UI Action';
        current.update();

        if (bcrSysid != '' && current.u_type == 'BCR') { // is a BCR
            // is this a BCR Task?, if so, update the BCR
            var bcrSysid = current.getValue('u_baseline_change_request');
            bcrSysid = bcrSysid.toString();

            var bcrRec = new GlideRecord('u_evt_bcr');
            bcrRec.get(bcrSysid);
            bcrRec.setValue('u_state', closedIncomplete);
            bcrRec.setValue('u_approval', current.approval);
            bcrRec.update();
        }

        if (swaSysid != '' && current.u_type == 'SWA') { // is an SWA
            // is this an SWA? if so, update the SWA
            var swaSysid = current.getValue('u_swa');
            swaSysid = swaSysid.toString();            

            var swaRec = new GlideRecord('u_evt_swa');
            swaRec.get(swaSysid);            
            swaRec.setValue('u_state', closedIncomplete);
            swaRec.setValue('u_approval', current.approval);
            swaRec.update();	
        }
    } catch (ex) {
        var message = ex.getMessage();
        gs.error(message);
    }

} // end of serverCode
action.setRedirectURL(current);