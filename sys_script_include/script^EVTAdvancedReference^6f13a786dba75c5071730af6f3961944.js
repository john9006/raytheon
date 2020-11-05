var EVTAdvancedReference = Class.create();
EVTAdvancedReference.prototype = {
    initialize: function() {
    },
	// Find the CRLS
	getCDRLReferences:function() {
		var evtUtil = new GlideRecord("u_evt_utility_reference");
		evtUtil.addActiveQuery();
		evtUtil.addQuery('u_project', current.u_project);
		evtUtil.addQuery('u_type', 'CDRL');
		evtUtil.query();
		
		var cdrlArray = [];
		while(evtUtil.next()) {
			
			cdrlArray.push(evtUtil.sys_id.toString());
			
		}
		
		return 'sys_idIN' + cdrlArray;
		
	},
	// Find the Contract Ammendment Proposals
	getCAPReferences:function() {
		var evtUtil = new GlideRecord("u_evt_utility_reference");
		evtUtil.addActiveQuery();
		evtUtil.addQuery('u_project', current.u_project);
		evtUtil.addQuery('u_type', 'CAP');
		evtUtil.query();
		
		var capArray = [];
		while(evtUtil.next()) {
			//gs.info('>> evtUtil record id is ' + evtUtil.u_id );
			capArray.push(evtUtil.sys_id.toString());
			
		}
		
		return 'sys_idIN' + capArray;
		
	},
	// Find the Contract Ammendment Proposals
	getSOWReferences:function() {
		var evtUtil = new GlideRecord("u_evt_utility_reference");
		evtUtil.addActiveQuery();
		evtUtil.addQuery('u_project', current.u_project);
		evtUtil.addQuery('u_type', 'SOW');
		evtUtil.query();
		
		var sowArray = [];
		while(evtUtil.next()) {
			//gs.info('>> evtUtil record id is ' + evtUtil.u_id );
			sowArray.push(evtUtil.sys_id.toString());
			
		}
		
		return 'sys_idIN' + sowArray;
		
	},
	// Find the items of a type in the Utility table
	getReferencesForType:function(record_type) {
		
		var evtUtil = new GlideRecord("u_evt_utility_reference");
		evtUtil.addActiveQuery();
		evtUtil.addQuery('u_project', current.u_project);
		evtUtil.addQuery('u_type', record_type);
		evtUtil.query();
		
		var listArray = [];
		while(evtUtil.next()) {			
			listArray.push(evtUtil.sys_id.toString());			
		}
		
		return 'sys_idIN' + listArray;
		
	},
	getReferencesForSWA: function(){
		var evtSWA = new GlideRecord('u_evt_swa');
		evtSWA.addQuery('u_project', current.u_project);
		evtSWA.query();
		var swaArray = [];
		while(evtSWA.next()) {			
			swaArray.push(evtSWA.sys_id.toString());			
		}
		
		return 'sys_idIN' + swaArray;
		
	},
	getReferencesForWBS: function(){
		var evtWBS = new GlideRecord('u_evt_wbs');
		evtWBS.addQuery('u_project', current.u_project);
		evtWBS.query();
		var wbsArray = [];
		while(evtWBS.next()) {			
			wbsArray.push(evtWBS.sys_id.toString());			
		}
		
		return 'sys_idIN' + wbsArray;
		
	},
	getReferencesForWbsControlAccount: function(){
		var evtWBS = new GlideRecord('u_evt_wbs');
		evtWBS.addQuery('u_project', current.u_project);
		//evtWBS.addQuery('u_control_account', true);
		evtWBS.query();
		var wbsArray = [];
		while(evtWBS.next()) {			
			wbsArray.push(evtWBS.sys_id.toString());			
		}
		
		return 'sys_idIN' + wbsArray;
		
	},
	// Find the items in the Utility table
	getProducerRefsForType: function(record_type) {		
		var evtUtil = new GlideRecord("u_evt_utility_reference");
		evtUtil.addActiveQuery();
		evtUtil.addQuery('u_project', current.variables.u_project);
		evtUtil.addQuery('u_type', record_type);
		evtUtil.query();
		
		var listArray = [];
		while(evtUtil.next()) {			
			listArray.push(evtUtil.sys_id.toString());			
		}
		
		return 'sys_idIN' + listArray;
		
	},
	
	getDefaultApproverForRole: function(role_descriptor) {
		var approverArray = [];
		
		var approverRec = new GlideRecord('u_evt_default_approver');
		approverRec.addQuery('u_project', current.u_project);
		approverRec.addQuery('u_role_descriptor', role_descriptor);
		approverRec.query();
		
		while(approverRec.next()){
			approverArray.push(approverRec.u_approver.toString());			
		}
		
		return 'sys_idIN' + approverArray;
	},

    type: 'EVTAdvancedReference'
};