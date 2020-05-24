function KSAssGrpFilter() {

	var answer = '';
	// Get the current assigned to
	var assigned_to_id = '' + current.assigned_to;
	if(assigned_to_id == '') {
		answer = 'typeISEMPTY^active=true^ORDERBYname';
	}
	else {
		// Create variables for the groups and users
		var groups = new GlideRecord('sys_user_grmember');
		var user_record = new GlideRecord('sys_user');
		
		// Check there is a valid assigned to user
		if(user_record.get(assigned_to_id)){
			
			//Query to find all the groups of the assigned to
			groups.addQuery('user',assigned_to_id);
			groups.addQuery('group.active', 'true');
			groups.addNullQuery('group.type');
			groups.query();
			while (groups.next()){
				//add the sys_id of the group to the search string
				if (answer.length > 1) {
					answer += "^ORsys_id=" + groups.group;
				}
				else {
					answer += "sys_id=" + groups.group;
				}
			}
		}
	}
	return answer;
}