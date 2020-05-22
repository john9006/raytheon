function reworkDialog() {
    var sysId = typeof rowSysId == 'undefined' ? gel('sys_uniqueValue').value : rowSysId;
    var gDialog = new GlideModal("task_reject_rework"); // instantiate with ui page
    gDialog.setTitle('Rework Rejection');
    gDialog.setPreference('sysparm_sysID', g_form.sysID);

    gDialog.render();


}