var EVTUtilsAjax = Class.create();
EVTUtilsAjax.prototype = Object.extendsObject(AbstractAjaxProcessor, {

    getDefaultApprovers: function() {
        var project = this.getParameter('sysparm_project');
        var recType = this.getParameter('sysparm_recType');
        var level = this.getParameter('sysparm_level');

        var approv = new GlideRecord('u_evt_default_approver');
        approv.addQuery('u_project', project);
        approv.addQuery('u_level', level);
        approv.query();

        appArr = [];

        while (approv.next()) {         
           
            if (approv.getValue('u_type').indexOf(recType) > -1) {                
                appArr.push(approv.u_approver.sys_id);
            }
        }
        var approver_list = appArr.join(",");
       
		var answer = approver_list;
        return answer;
    },
	
	getWBSData: function() {
		
		var wbsID = this.getParameter('sysparm_wbs');
		//gs.log('WBS ID is: ' + wbsID);
		var responseArr = [];
		
		var wbsGR = new GlideRecord('u_evt_wbs');
		wbsGR.addQuery('sys_id', wbsID);
		wbsGR.query();
		
		while (wbsGR.next()){
			
			var controlAccountVal;
			var rootWBSVal;
			var activeVal;
			
			if (wbsGR.getValue('u_control_account') == '1'){
				controlAccountVal = 'Yes';
			}
			else{
				controlAccountVal = 'No';
			}
			if (wbsGR.getValue('u_root_wbs') == '1'){
				rootWBSVal = 'Yes';
			}
			else{
				rootWBSVal = 'No';
			}
			if (wbsGR.getValue('u_active') == '1'){
				activeVal = 'Yes';
			}
			else{
				activeVal = 'No';
			}
		
			/** 
			responseArr.push({
				fieldName: 'u_project',
				fieldValue: wbsGR.getValue('u_project'),
			}); 
			**/
			
			responseArr.push({
				fieldName: 'u_prepared_by',
				fieldValue: wbsGR.getValue('u_prepared_by'),
			});
			responseArr.push({
				fieldName: 'u_parent',
				fieldValue: wbsGR.getValue('u_parent'),
			});
			responseArr.push({
				fieldName: 'u_control_account',
				fieldValue: controlAccountVal,
			});
			responseArr.push({
				fieldName: 'u_root_wbs',
				fieldValue: rootWBSVal,
			});
			responseArr.push({
				fieldName: 'u_obs',
				fieldValue: wbsGR.getValue('u_obs'),
			});
			responseArr.push({
				fieldName: 'u_wbs_number',
				fieldValue: wbsGR.getValue('u_wbs_number'),
			});
			responseArr.push({
				fieldName: 'u_title',
				fieldValue: wbsGR.getValue('u_title'),
			});
			responseArr.push({
				fieldName: 'u_cdrl',
				fieldValue: wbsGR.getValue('u_cdrl'),
			});
			responseArr.push({
				fieldName: 'u_caps',
				fieldValue: wbsGR.getValue('u_caps'),
			});
			responseArr.push({
				fieldName: 'u_sow',
				fieldValue: wbsGR.getValue('u_sow'),
			});
			responseArr.push({
				fieldName: 'u_description',
				fieldValue: wbsGR.getValue('u_description'),
			});
			responseArr.push({
				fieldName: 'u_input_output',
				fieldValue: wbsGR.getValue('u_input_output'),
			});
			responseArr.push({
				fieldName: 'u_assumptions_exclusions',
				fieldValue: wbsGR.getValue('u_assumptions_exclusions'),
			});
			responseArr.push({
				fieldName: 'u_government_furnished_items',
				fieldValue: wbsGR.getValue('u_government_furnished_items'),
			});
			responseArr.push({
				fieldName: 'u_other_details',
				fieldValue: wbsGR.getValue('u_other_details'),
			});
			responseArr.push({
				fieldName: 'u_active',
				fieldValue: activeVal,
			});
		}
		
		var json = new JSON();
		var responseObj = json.encode(responseArr);
		
		//gs.log('WBS Data Retreival Complete. Response Object is: ' + responseObj.toString());
		
		return responseObj;
		
	},
	
	checkWBSNumberValidity: function(){
		
		var wbsProgram = this.getParameter('wbsProgram');
		var wbsNumVal = this.getParameter('wbsNumVal');
		var isUpdate = this.getParameter('isUpdate');
		var updateRecID = this.getParameter('updateRecID');
		
		var evtWBS = new GlideRecord('u_evt_wbs');
		
		if (isUpdate == 'true'){
			evtWBS.addQuery('sys_id', updateRecID);
			evtWBS.query();
			while (evtWBS.next()){
				if (evtWBS.getValue('u_wbs_number') == wbsNumVal){
				return 'true';
				}
				else {
					return 'false';
				}
			}
			
		}
		
		else if (isUpdate == 'false'){
			
			evtWBS.addQuery('u_project', wbsProgram);
			evtWBS.addQuery('u_wbs_number', wbsNumVal);
			evtWBS.query();
			
			if (evtWBS.next()){
				return 'false';
			}
			else {
				return 'true';
			}
			
		}
		
	},



    type: 'EVTUtilsAjax'
});