(function executeRule(current, previous /*null when async*/) {
	
	var bcrRec = new GlideRecord('u_evt_bcr');
	bcrRec.get(current.u_baseline_change_request);	
	bcrRec.setValue('u_approval', current.approval);
	bcrRec.update();
	

})(current, previous);