(function executeRule(current, previous /*null when async*/ ) {

    var type;
    if (current.u_type == 'BCR') {
        type = current.u_bcr_type; //subtype for BCR
    }
    if (current.u_type == 'SWA') {
        type = current.u_type;
    }

    var approv = new GlideRecord('u_evt_default_approver');
    approv.addQuery('u_project', current.u_project);
    approv.addQuery('u_level', 1);
    approv.query();
    
    var appArr = [];

    while (approv.next()) {
		//gs.info('>> u_type is ' + approv.getValue('u_type') + ' the value of type is ' + type);
        if (approv.getValue('u_type').indexOf(type) > -1) {
            appArr.push(approv.u_approver.toString());

        }
    }

    var approver_list = appArr.join(',');

    current.u_level_1_approver = approver_list;


})(current, previous);