var FRUCatalogWorkflowUtils = Class.create();
FRUCatalogWorkflowUtils.prototype = {
	initialize: function() {
		this.IT_COST_CENTER = gs.getProperty("ray.it.cost.center");
		this.PRICE_THRESHOLD = Number(gs.getProperty("ray.it.price.threshold"));
		this.dbg = new FRUDebugUtils('FRUCatalogWorkflowUtils');
	},

	//Calculate Full GL Codes based on Item GL Codes, projects and cost centres
	calculateFullGLCodes: function (isProject, request_id, project_id) {

		var gr = new GlideRecord("sc_req_item");
		gr.addQuery("request", request_id);
		gr.query();

		while (gr.next()) {
			var category = gr.cat_item.u_procurement_category;
			var gl_code;
			var cost_center;
			var full_gl_code;

			//If project, the Cost Center is the one associated to the project
			if (isProject) {
				var project = new GlideRecord("u_project_code");
				if (project.get(project_id))
					cost_center = project.u_cost_centre.code;

				//Project: 2nd GL Code
				gl_code = gr.cat_item.u_gl_code_2.u_gl_code;
			} else {

				//Calculate Cost Centre
				var cc = new GlideRecord("cmn_cost_center");
				var temp_cc;
				if (cc.get(this.IT_COST_CENTER)) {
					temp_cc = cc.account_number;
				}

				var department;
				var gru = new GlideRecord("sys_user");
				if (gru.get(gs.getUserID())) {
					department = gru.department.getRefRecord();
				}

				if (category == "hardware" || category == "general") {
					//For hardware or general requests
					if (parseInt(gr.cat_item.price) > this.PRICE_THRESHOLD || this.isRITMPriceExceedingThreshold(gr)) {
						cost_center = department.cost_center.code;
					} else {
						cost_center = temp_cc;
					}
				} else if (category == "software") {
					//For software
					cost_center = department.cost_center.code;
				} else {
					//Other (Service Plan)
					cost_center = temp_cc;
				}

				//Non-project: Get 1st GL Code
				gl_code = gr.cat_item.u_gl_code_1.u_gl_code;
			}
			full_gl_code = cost_center + "-" + gl_code;

			if (gr.u_full_gl_code != full_gl_code) {
				gr.u_full_gl_code = full_gl_code;
				gr.update();
			}
		}
	},

	countGeneralRequestsExceedingThreshold: function (request_id) {
		var count = 0;
		var item = new GlideRecord("sc_req_item");  
		item.addQuery("request", request_id);  
		item.query();  
		if (item.next()) {
			if (item.variable_pool.price) {
				//Find variable price, and check price if it exists
				var price = parseFloat(item.variable_pool.price.getDisplayValue());
				if (price > this.PRICE_THRESHOLD) {
					count++;
				}
			}	
		}
		return count;
	},

	getLTApprovalUsers: function(_current){
		this.dbg.FRUDebug('getLTApprovalUsers: Getting LT Approval users');
		var answer = [];

		//if (_current.u_requestor.department.primary_contact != _current.u_requestor.manager)

		answer.push(_current.u_requestor.department.primary_contact);
		//gets information from Department

		return answer;

	},
	getFinancialApprovalUsers: function(_current){
		this.dbg.FRUDebug('getFinancialApprovalUsers: Getting LT Approval users');
		var answer = [];
		//Gets information from cost centre

		return answer;

	},
	//Get Head of IT Approver
	getHOITApprovalUsers: function(current){
		this.dbg.FRUDebug('getHOITApprovalUsers: Getting LT Approval users');
		var answer = [];
		//IT Manager Group

		return answer;

	},
	getLineManagerApprovalUsers: function(_current){
		this.dbg.FRUDebug('getLineManagerApprovalUsers: Getting Line Manager');
		var answer = [];
		//From requested for Manager

		//gs.log('Getting Approver for ' + current.requested_for.manager.getDisplayValue());
		if(JSUtil.notNil(current.requested_for.manager)){
			var me = new GlideRecord('sys_user');
			if(me.get(current.requested_for.manager.toString())){
				//me = me.getUserByID(current.requested_for.manager.toString());
				var mgr = me.user_name;
				//gs.log('Getting Approver ' + mgr);
				answer.push(mgr);
			}
		}
		return answer;
	},
	getChangeManagersLineManager: function(){
		//get the change managers from the "Change Manager" group
		this.dbg.FRUDebug('getLoggedInUserLineManager: Getting Change Manager for Expedited Approval' );
		var members = [];
		var answer = [];
		var groupobj = this.getAssignmentGroupByName('Change Manager');
		this.dbg.FRUDebug('getLoggedInUserLineManager: Found Group ID for Expedited Approval' + groupobj.sys_id );
		if(JSUtil.notNil(groupobj)){
			members = this.getAssigneesByGroup(groupobj.sys_id);
			this.dbg.FRUDebug('getLoggedInUserLineManager: Found Members' + members.join(','));
			if(JSUtil.notNil(members)){
				for (a=0;a<members.length;a++){
					var me = new GlideRecord('sys_user');
					if(me.get(members[a])){
						//me = me.getUserByID(current.requested_for.manager.toString());
						var mgr = me.manager.sys_id;
						this.dbg.FRUDebug('getLoggedInUserLineManager: Manager is ' + me.manager.getDisplayValue());
						if(JSUtil.notNil(mgr))
							answer.push(mgr);
					}
				}
			}

		}
		this.dbg.FRUDebug('getLoggedInUserLineManager: Returning answer: ' + answer.join(','));
		return answer.join(',');
	},
	getChangeOwnersLineManager: function(_current){
		//get the change owners managers from the change request
		this.dbg.FRUDebug('getChangeOwnersLineManager: Getting Change owners line Manager for Expedited Approval of '+
						  _current.number);
		var answer = [];
		var owner = _current.u_change_owner;
		this.dbg.FRUDebug('getChangeOwnersLineManager: Getting manager for change owner ' + owner.name);
		var manager = owner.manager;
		this.dbg.FRUDebug('getChangeOwnersLineManager: Manager is ' + manager.getDisplayValue());
		if(JSUtil.notNil(manager)){
			answer.push(manager.toString());
		}
		this.dbg.FRUDebug('getChangeOwnersLineManager: Returning answer: ' + answer.join(','));
		return answer.join(',');
	},
	//Added because you cant select the Manual Approvers list in the Workflow editor.
	getManualApprovers: function(_current){
		if(JSUtil.notNil(_current.u_approver_list)){
			return _current.u_approver_list;
		}
		else
			return null;
	},
	//Generate Task for missing Approver information
	generateMissingApproverTask: function(_current,_task,_activity,_message){
		this.dbg.FRUDebug('generateMissingApproverTask: Generating Task for missing approver');
		if(JSUtil.notNil(_activity)){
			this.dbg.FRUDebug('generateMissingApproverTask: Activity contains: ' + JSON.stringify(_activity));

		}
		if(JSUtil.notNil(_current) && JSUtil.notNil(_task)){
			_task.short_description = 'Approval skipped for Request ' + _current.getDisplayValue();
			_task.description = _message;
			_task.caller_id = _current.requested_for;
			_task.contact_type = 'Workflow';
			_task.category = 'Configuration';
			_task.u_request = _current.sys_id;
		}
		return;

	},
	//Returns the Group object for the name or null if not found.
	getAssignmentGroupByName: function(_name){
		this.dbg.FRUDebug('getAssignmentGroupByName: Getting assignment group id for name ' + _name);
		var grp = new GlideRecord('sys_user_group');
		grp.addQuery('name',_name);
		grp.query();
		if(grp.next()){
			var id = grp.sys_id;
			this.dbg.FRUDebug('getAssignmentGroupByName: Found assignment group id for name ' + _name + ' (' + id + ')');
			return grp;
		}
		return null;
	},
	//Return the Group object for the name or null if not found.
	getAssigneesByGroup: function(_groupid){
		this.dbg.FRUDebug('getAssigneesByGroup: Getting assignment group id for name ' + _groupid);
		var members = [];
		var grp = new GlideRecord('sys_user_grmember');
		grp.addQuery('group',_groupid);
		grp.query();
		while(grp.next()){
			var id = grp.sys_id;
			this.dbg.FRUDebug('getAssigneesByGroup: Adding assignee ' + grp.user.getDisplayValue());
			members.push(grp.user.toString());
		}
		this.dbg.FRUDebug('getAssigneesByGroup: Returning members: ' + members.join(','));
		return members;
	},
	containsComplexItems: function(_current){
		//search all requested items for sc_cat_item.u_complex_item = true
		this.dbg.FRUDebug('containsComplexItems: Searching for Complex Request items in  ' + _current.number);
		var id = _current.sys_id;
		var count = 0;
		var ritm = new GlideAggregate('sc_req_item');
		ritm.addAggregate('COUNT');
		ritm.addQuery('request',id);
		ritm.addQuery('cat_item.u_complex_item','=','true');
		this.dbg.FRUDebug('containsComplexItems: Executing query:  ' + ritm.getEncodedQuery());
		ritm.query();
		if(ritm.next()){
			count = ritm.getAggregate('COUNT');
		}
		this.dbg.FRUDebug('containsComplexItems: Found ' + count + ' Complex Request items.');

		//If no complex item, make sure there is no General Request with a price over 5000$AUD
		//if (count == 0) {
		//	count = this.countGeneralRequestsExceedingThreshold(_current.sys_id);
		//}

		return count;
	},
	//Check to see if  there are matching records and set the workflow scratchpad to parent
	//Criteria = Same Request, Vendor(not set),Purchase decision
	//NOTE: if more than 1 exists, set to first record found.
	checkExistingPOTasks: function(_current,_workflow){
		this.dbg.FRUDebug('checkExistingPOTasks: Looking for existing PO Task related to ' + _current.number);
		var request = _current.request;
		var ritem = new GlideRecord('sc_req_item');
		ritem.addQuery('request',request);
		ritem.addQuery('cat_item.vendor',_current.cat_item.vendor);
		ritem.addQuery('state','IN','-5,1,2,300');
		ritem.addQuery('received',false);
		ritem.addNullQuery('parent');
		//ritem.addQuery('cat_item',_current.cat_item);
		ritem.addQuery('sys_id','!=',_current.sys_id);
		ritem.addQuery('u_purchase_decision','Purchase');
		ritem.orderBy('sys_updated_on');
		this.dbg.FRUDebug('checkExistingPOTasks: Executing query: ' + ritem.getEncodedQuery());
		ritem.query();
		if(ritem.next()){
			if(ritem.getRowCount() > 1){
				this.dbg.FRUDebug('checkExistingPOTasks: Found more than 1 record matching criteria. Setting scratchpad.parentTask to ' + ritem.sys_id.toString());

			}
			this.dbg.FRUDebug('checkExistingPOTasks: Updating ' + _current.number + ' with parent ' + ritem.number + '(' + ritem.sys_id.toString() + ')');
			_current.parent = ritem.sys_id.toString();
			_current.update();

		}
		return;

	},
	//Reset the approval that triggered More Info back to Requested.
	resetMoreInfoApproval: function(_current){
		this.dbg.FRUDebug('resetMoreInfoApproval: Resetting More Info Approval for Change ' + _current.number);
		var appr = new GlideRecord('sysapproval_approver');
		appr.addQuery('state','more_info');
		appr.addQuery('sysapproval',_current.sys_id);
		this.dbg.FRUDebug('resetMoreInfoApproval: Executing query on approval table: ' + appr.getEncodedQuery());
		appr.query();
		while (appr.next()){
			this.dbg.FRUDebug('resetMoreInfoApproval: Updating approval for : ' + appr.wf_activity.getDisplayValue() + ' Approver: ' + appr.approver.getDisplayValue());
			appr.state = 'requested';
			appr.update();
		}

	},

	getUserFieldValue: function (user, field) {
		var gr = new GlideRecord("sys_user");
		if (gr.get(user)) {
			return gr.getValue(field);
		}
		return "";
	},

	getUserLocationSupport: function (requestor) {
		var CC_PARENT = "2c8b1a70db0347006f8236db7c9619d9"; //Parent Client Computing group
		var location = this.getUserFieldValue(requestor, "location");
		
		gs.log("Location: " + location, "MPO02");

		var gr = new GlideRecord("sys_group_covers_location");
		gr.addQuery("location", location);
		gr.addQuery("group.parent", CC_PARENT);
		gr.query();
		if (gr.next()) {
			gs.log("Location support group: " + gr.getUniqueValue(), "MPO02");
			return gr.group;
		}
		gs.log("Out: " + location, "MPO02");
		return "";
	},

	type: 'FRUCatalogWorkflowUtils'
};