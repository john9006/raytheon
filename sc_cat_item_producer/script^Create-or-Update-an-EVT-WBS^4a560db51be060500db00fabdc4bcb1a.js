// Manual Field Maps & Validation

var producerAction = producer.create_or_update;
var wbsNum = producer.u_wbs_number;
var wbsProjName = producer.wbs_program.u_name;
var spURL = '/sp';

if (producerAction == 'create'){
	
	// Set Fields on 'Current' object, then allow insert.
	current.u_title = producer.u_title;
	current.u_wbs_number = producer.u_wbs_number;
	current.u_prepared_by = producer.u_prepared_by;
	current.u_project = producer.wbs_program;
	current.u_parent = producer.u_parent;
	
	// Value validation for checkbox fields
	if (producer.u_root_wbs == 'No'){
		current.u_root_wbs = 0;
	}
	else if (producer.u_root_wbs == 'Yes'){
		current.u_root_wbs = 1;
	}
	if (producer.u_control_account == 'No'){
		current.u_control_account = 0;
	}
	else if (producer.u_control_account == 'Yes'){
		current.u_control_account = 1;
	}
	if (producer.u_active == 'No'){
		current.u_active = false;
	}
	else if (producer.u_active == 'Yes'){
		current.u_active = true;
	}
	
	current.u_obs = producer.u_obs;
	current.u_cdrl = producer.u_cdrl;
	current.u_caps = producer.u_caps;
	current.u_sow = producer.u_sow;
	current.u_description = producer.u_description;
	current.u_input_output = producer.u_input_output;
	current.u_assumptions_exclusions = producer.u_assumptions_exclusions;
	current.u_government_furnished_items = producer.u_government_furnished_items;
	current.u_other_details = producer.u_other_details;
	
	gs.addInfoMessage('EVT WBS Number ' + wbsNum + ' for project ' + wbsProjName + ' was successfully created. Thank you.');
	
	producer.redirect = "sp";
	producer.portal_redirect = "sp";
	
}

else if (producerAction == 'update'){
	
	// Set Field Values on existing record, then cancel any insert of new records
	
	var wbsGR = new GlideRecord('u_evt_wbs');
	wbsGR.addQuery('sys_id', producer.wbs_to_update);
	wbsGR.query();
	while (wbsGR.next()){
		
		wbsGR.u_title = producer.u_title;
		wbsGR.u_wbs_number = producer.u_wbs_number;
		wbsGR.u_prepared_by = producer.u_prepared_by;
		wbsGR.u_project = producer.wbs_program;
		wbsGR.u_parent = producer.u_parent;

		// Value validation for checkbox fields
		if (producer.u_root_wbs == 'No'){
			wbsGR.u_root_wbs = 0;
		}
		else if (producer.u_root_wbs == 'Yes'){
			wbsGR.u_root_wbs = 1;
		}
		if (producer.u_control_account == 'No'){
			wbsGR.u_control_account = 0;
		}
		else if (producer.u_control_account == 'Yes'){
			wbsGR.u_control_account = 1;
		}
		if (producer.u_active == 'No'){
			wbsGR.u_active = false;
		}
		else if (producer.u_active == 'Yes'){
			wbsGR.u_active = true;
		}

		wbsGR.u_obs = producer.u_obs;
		wbsGR.u_cdrl = producer.u_cdrl;
		wbsGR.u_caps = producer.u_caps;
		wbsGR.u_sow = producer.u_sow;
		wbsGR.u_description = producer.u_description;
		wbsGR.u_input_output = producer.u_input_output;
		wbsGR.u_assumptions_exclusions = producer.u_assumptions_exclusions;
		wbsGR.u_government_furnished_items = producer.u_government_furnished_items;
		wbsGR.u_other_details = producer.u_other_details;
		
		wbsGR.update();
		
		gs.addInfoMessage('EVT WBS Number ' + wbsNum + ' for project ' + wbsProjName + ' was successfully updated. Thank you.');
		
		current.setAbortAction(true);
		
		producer.redirect = "sp";
		producer.portal_redirect = "sp";
		
	}
	
}