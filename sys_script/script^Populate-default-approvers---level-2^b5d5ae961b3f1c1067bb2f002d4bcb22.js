(function executeRule(current, previous /*null when async*/ ) {
    var type;
    if (current.u_type == 'BCR') {
        type = current.u_bcr_type;
    }
    if (current.u_type == 'SWA') {
        type = current.u_type;
    }
    var approv = new GlideRecord('u_evt_default_approver');
    approv.addQuery('u_project', current.u_project);
    approv.addQuery('u_level', 2);
    approv.query();

    var appArr = [];

    while (approv.next()) {
        if (approv.getValue('u_type').indexOf(type) > -1) {
            appArr.push(approv.u_approver.toString());
        }
    }

    var approver_list = appArr.join(',');

    current.u_level_2_approver = approver_list;

})(current, previous);