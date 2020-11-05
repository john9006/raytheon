(function executeRule(current, previous /*null when async*/) {

	var apprvl= new GlideRecord('sysapproval_approver');
	apprvl.initialize();
	gs.info('>> u_level_1_approver is ' + current.getValue('u_level_1_approver'));
	var userArr = current.getValue('u_level_1_approver').toString().split(",");	
	
	for(var i=0; i < userArr.length; i++) {
		gs.info('user id is ' + userArr[i]);
		apprvl.approver= userArr[i];
		apprvl.sysapproval=current.sys_id;
		apprvl.source_table='u_evt_task';
		//apprvl.state='requested';
		
		apprvl.insert();
		
	}

	

})(current, previous);