var FRUChangeUtils = Class.create();
FRUChangeUtils.prototype = {
	initialize: function() {
		this.dbg = new FRUDebugUtils('FRUChangeUtils');
	},
	//Check start date is within criteria of;
	//Major change Lead time must be submitted COB Wednesday 1 week before scheduled date
	//Minor change Lead time must be submitted COB Monday for anything scheduled Wednesday onwards
	checkChangeLeadTime: function(_type,_startdate){
		this.dbg.FRUDebug('checkChangeLeadTime: Checking Lead time for ' + _type + ' change using date ' + _startdate);
		var answer = {
			"message":"",
			"result":false
		};
		var chgtype = _type.toLowerCase();
		var start = new GlideDateTime();
		start.setDisplayValue(_startdate);
		var now =  new GlideDateTime();
		var diff = 0;
		//First check the scheduled date is after today!
		diff = gs.dateDiff(now.getDisplayValue(),start.getDisplayValue(),true);
		this.dbg.FRUDebug('checkChangeLeadTime: Checking Start ' + start.getDisplayValue() + ' is after current date and time ' + now.getDisplayValue() + ' Difference: ' + diff);
		if(diff < 0){
			this.dbg.FRUDebug('checkChangeLeadTime: Start Date before now; Exiting ');
			answer.message = "Start Date is before current date and time: " + now.getDisplayValue();
			answer.result = false;
		}
		else {
			//Checkdate is the date to compare
			// For Major - the scheduled start time is after the following Wednesday in one week's time
			// For Minor - the scheduled start time is after the upcoming Wednesday at least two days in the future
			//Cabday is the date of the next CAB (usually Wednesday)
			var checkdate = new GlideDateTime();
			var cabday = 'Wednesday'; //Set default
			var submitday = 'Monday';
			var submitdatetime = new GlideDateTime();
			var leadtime = 0;
			if(JSUtil.notNil(_type)){
				if(chgtype == 'major'){
					//Get property for CAB Day in case it changes.
					cabday = gs.getProperty('custom.change_request.CABDay.Major','Wednesday');
					//Planned start must be at least 3 days from now and after the next CAB
					leadtime = 3;
					//Add 3 days to now
					checkdate.addDaysLocalTime(leadtime);
				}
				if(chgtype == 'minor'){
					//Get property for CAB Day in case it changes.
					cabday = gs.getProperty('custom.change_request.CABDay.Major','Wednesday');
					submitday = gs.getProperty('custom.change_request.SubmitDay.Minor','Monday');
					leadtime = 1;
					checkdate.addDaysLocalTime(leadtime);
					submitdatetime = this.getNextDateByDay(submitday,now.getDisplayValue());
					this.dbg.FRUDebug('checkChangeLeadTime: Next Submit Date for Minor Change is ' + submitdatetime.getDisplayValue());
				}
				if(chgtype == 'expedited'){
					//Get property for CAB Day in case it changes.
					cabday = gs.getProperty('custom.change_request.CABDay.Major','Wednesday');
					leadtime = 1;
					checkdate.addDaysLocalTime(leadtime);
				}
				if(chgtype == 'emergency'){
					//Get property for CAB Day in case it changes.
					cabday = gs.getProperty('custom.change_request.CABDay.Major','Wednesday');
					leadtime = 0;
					checkdate.addDaysLocalTime(leadtime);
				}
			}
			this.dbg.FRUDebug('checkChangeLeadTime: Getting Next CAB Date for Change Type: ' + _type + ' CAB day: ' + cabday + ' change using date ' + checkdate + ' lead time is ' + leadtime + ' days.');
			//Get the next CAB Date from now
			//Based on the adjusted date (7 days lead for Major, 2 days lead for Minor)
			var nextCabDate;
			if(chgtype == 'major')
				nextCabDate = this.getNextDateByDay(cabday,checkdate.getDisplayValue());
			else
				nextCabDate = this.getNextDateByDay(cabday,now.getDisplayValue());
			
			this.dbg.FRUDebug('checkChangeLeadTime: Next CAB Date is: ' + nextCabDate.getDisplayValue());
			//Check if there is sufficient lead time (Major=7days, Minor=3days)
			//var leadtime = gs.dateDiff(now.getDisplayValue(),nextCabDate.getDisplayValue());
			var cobdate;
			var adjdate;
			if(JSUtil.notNil(nextCabDate)){
				this.dbg.FRUDebug('checkChangeLeadTime: Getting COB for CAB Date Local: ' + nextCabDate.getDisplayValue() + ' Internal:' + nextCabDate.getValue());
				cobdate = this.getCOBDate(nextCabDate.getDisplayValue());
				this.dbg.FRUDebug('checkChangeLeadTime: CAB Date now Local: ' + cobdate.getDisplayValue() + ' Internal:' + cobdate.getValue());
			}
			
			//Difference between the start date and Close of Business CAB Date (in seconds)
			var cabdiff = gs.dateDiff(cobdate.getDisplayValue(),start.getDisplayValue(),true);
			this.dbg.FRUDebug('checkChangeLeadTime: Checking Start ' + start.getDisplayValue() + ' against Adjusted date ' + cobdate.getDisplayValue() + ' Difference: ' + cabdiff);
			if (chgtype == 'major'){
				if(cabdiff <= 0){
					answer.message = "Start Date must be after next CAB date " + cobdate.getDisplayValue();
					answer.result = false;
				}
				else {
					answer.message = "Start Date is after next CAB date "  + cobdate.getDisplayValue();
					answer.result = true;
				}
			}
			else if (chgtype == 'minor'){
				//Check Submit Time difference
				var submitdiff = gs.dateDiff(now.getDisplayValue(),submitdatetime.getDisplayValue(),true);
				this.dbg.FRUDebug('checkChangeLeadTime: Comparing time between now ' + now.getDisplayValue() + ' and submittime ' + submitdatetime.getDisplayValue() + ' Difference: ' + submitdiff);
				//Check Lead Time difference
				var leaddiff = parseInt(gs.dateDiff(now.getDisplayValue(),start.getDisplayValue(),true));
				var daysecs = parseInt(86400 * leadtime);
				this.dbg.FRUDebug('checkChangeLeadTime: Comparing time between now and start difference ' + leaddiff + ' with lead time ' + daysecs);
				if(leaddiff < daysecs){
					this.dbg.FRUDebug('checkChangeLeadTime: Insufficient Lead time for Minor change ' + leaddiff + ' seconds.');
					answer.message = "Insufficient Lead time for Minor change. < " + parseFloat(leaddiff/86400).toFixed(2) + " days.";
					answer.result = false;
				}
				else if(submitdiff < 0){
					this.dbg.FRUDebug('checkChangeLeadTime: Submit date is not before next CAB date ' + nextCabDate.getDisplayValue());
					answer.message = "Submit date is not before next CAB date " + nextCabDate.getDisplayValue();
					answer.result = false;
					
				}
				//Check CAB Date
				else if(cabdiff <= 0){
					this.dbg.FRUDebug('checkChangeLeadTime: Start Date before next CAB date ' + cobdate.getDisplayValue());
					answer.message = "Start Date must be after next CAB date " + cobdate.getDisplayValue();
					answer.result = false;
				}
				else {
					this.dbg.FRUDebug('checkChangeLeadTime: Start Date is after next CAB date  ' + cobdate.getDisplayValue());
					answer.message = "Start Date is after next CAB date "  + cobdate.getDisplayValue();
					answer.result = true;
				}
// 				else {
// 					this.dbg.FRUDebug('checkChangeLeadTime: ISufficient Lead time for Minor change ' + leaddiff + ' seconds.');
// 					answer.message = "Sufficient Lead time for Minor change "  + leaddiff + " seconds.";
// 					answer.result = true;
// 				}
				
			}
			else if (chgtype == 'emergency'){
					this.dbg.FRUDebug('checkChangeLeadTime: Change type is emergency. Ignoring CAB dates ');
					answer.message = "Change type is emergency. Ignoring CAB dates ";
					answer.result = true;				
			}
			else if (chgtype == 'expedited'){
					this.dbg.FRUDebug('checkChangeLeadTime: Change type is expedited. Ignoring CAB dates ');
					answer.message = "Change type is expedited. Ignoring CAB dates ";
					answer.result = true;				
			}
		}
		this.dbg.FRUDebug('checkChangeLeadTime: Returning answer: ' + JSON.stringify(answer));
		return answer;
	},
	//Returns a GlideDateTime object of the next day of the week entered.
	//Calculates from now if no start entered or from the date entered
	//E.g. getNextDateByDay('Thursday','2017-12-25 14:00:00') will get the next Thursday after Xmas.
	getNextDateByDay: function(_day,_start){
		this.dbg.FRUDebug('getNextDateByDay: Getting the date for next ' + _day + ' starting on ' + _start);
		var gdt = new GlideDateTime();
		if(JSUtil.notNil(_start))
			gdt.setDisplayValue(_start);
		this.dbg.FRUDebug('getNextDateByDay: Start Date set to Localtime: ' + gdt.getDisplayValue() + ' Internal: ' + gdt.getValue());
		var day = _day.toLowerCase();
		var daynum = 0;
		switch (day){
			case 'monday':
			daynum = 1;
			break;
			case 'tuesday':
			daynum = 2;
			break;
			case 'wednesday':
			daynum = 3;
			break;
			case 'thursday':
			daynum = 4;
			break;
			case 'friday':
			daynum = 5;
			break;
			case 'saturday':
			daynum = 6;
			break;
			case 'sunday':
			daynum = 7;
			break;
		}
		this.dbg.FRUDebug('getNextDateByDay: ' + _day + ' converts to day number: ' + daynum);
		
		for(var a = 0; a <= 8; a++){
			//Add 1 day first to prevent today being the next weekday
			gdt.addDaysLocalTime(1);
			this.dbg.FRUDebug('getNextDateByDay: Checking getDayOfWeek ' + gdt.getDayOfWeek() + ' against day number ' + daynum  );
			if(gdt.getDayOfWeek() == daynum){
				break;
			}
		}
		this.dbg.FRUDebug('getNextDateByDay: Returning date local: ' + gdt.getDisplayValue() + ' Internal: ' + gdt.getValue());
		return gdt;
		
	},
	//Return the next CAB Date from the provided start date
	getNextCABDate: function(_type,_startdate){
		this.dbg.FRUDebug('getCABDate: Getting CAB Date for type ' + _type + ' using start date ' + _startdate);
		var checkdate = new GlideDateTime();
		if(JSUtil.notNil(_startdate))
			checkdate.setDisplayValue(_startdate);
		this.dbg.FRUDebug('getCABDate: Getting CAB Date for type ' + _type + ' using start date ' + checkdate.getDisplayValue());
		var cabday = 'Wednesday';
		var leadtime = 0;
		//Get the CAB date setting from system Properties
		if(JSUtil.notNil(_type)){
			if(_type.toLowerCase() == 'major'){
				//Get property for CAB Day in case it changes.
				cabday = gs.getProperty('custom.change_request.CABDay.Major','Wednesday');
				leadtime = 3;
				//Add 3 days to now
				checkdate.addDaysLocalTime(leadtime);
			}
			if(_type.toLowerCase() == 'minor'){
				//Get property for CAB Day in case it changes.
				cabday = gs.getProperty('custom.change_request.CABDay.Major','Wednesday');
				leadtime = 1;
				checkdate.addDaysLocalTime(leadtime);
			}
			if(_type.toLowerCase() == 'expedited'){
				//Get property for CAB Day in case it changes.
				cabday = gs.getProperty('custom.change_request.CABDay.Major','Wednesday');
				leadtime = 1;
				checkdate.addDaysLocalTime(leadtime);
			}
			if(_type.toLowerCase() == 'emergency'){
				//Get property for CAB Day in case it changes.
				cabday = gs.getProperty('custom.change_request.CABDay.Major','Wednesday');
				leadtime = 0;
				checkdate.addDaysLocalTime(leadtime);
			}
		}
		
		this.dbg.FRUDebug('getCABDate: Getting Next CAB Date for day: ' + cabday + ' Starting on ' + checkdate.getDisplayValue());
		//get Next date
		var cabdate = this.getNextDateByDay(cabday,checkdate);
		this.dbg.FRUDebug('getCABDate: Next CAB Date is Local time: ' + cabdate.getDisplayValue() + ' Internal time: ' + cabdate.getValue() );
		//Change to COB Date
		cabdate = this.getCOBDate(cabdate.getDisplayValue());
		this.dbg.FRUDebug('getCABDate: Adjust to COB CAB Date is Local time: ' + cabdate.getDisplayValue() + ' Internal time: ' + cabdate.getValue() );
		return cabdate;
	},
	//Return the datetime as Close of Business Time based on  the System property.
	getCOBDate: function(_datetime){
		this.dbg.FRUDebug('getCOBDate: Getting COB for ' + _datetime);
		//Set the COB time in a system property or use default '11:00:00'
		var cobtime = gs.getProperty('custom.change_request.COBTime','11:00:00');
		var gdt = new GlideDateTime();
		gdt.setDisplayValue(_datetime);
		//Get local date, not GMT Date
		var date = gdt.getLocalDate();
		this.dbg.FRUDebug('getCOBDate: Getting Local Date as ' + date);
		//var time = ' 17:00:00';
		var datestring = date + ' ' + cobtime;
		this.dbg.FRUDebug('getCOBDate: Setting new date to ' + datestring);
		gdt.setDisplayValue(datestring);
		this.dbg.FRUDebug('getCOBDate: Returning datetime as localtime:' + gdt.getDisplayValue() + ' Internal:' + gdt.getValue());
		return gdt;
	},
	changeBusinessServiceRefQual: function() {
		this.dbg.FRUDebug('changeBusinessServiceRefQual: Getting Reference Qualifier for Business Service ');
		//Story STRY0211750 - The Business Service field on Change requires a filter to ensure only Business Services with a Service Classification, exclude service offering and Billable Services
		//service_classificationINBusiness Service,Technical Service,Shared Service,Application Service
		var filter = 'service_classificationINBusiness Service,Technical Service,Shared Service,Application Service';
		this.dbg.FRUDebug('changeBusinessServiceRefQual: Returning filter:' + filter);
		return filter;
	},
	getCIBusinessOwners: function(_current){
		//get Affected CI Business Owners (Owned By)
		this.dbg.FRUDebug('getCIBusinessOwners: Getting list of Business Owners for Impacted Service CIs in change ' + _current.number);
		var answer = [];
		//get CIs from Affected Service CI table
		var rec = new GlideRecord('task_cmdb_ci_service');
		rec.addQuery('task', _current.sys_id);
		//rec.addQuery('cmdb_ci_service', _current.business_service);
		this.dbg.FRUDebug('getCIBusinessOwners: Executing query ' + rec.getEncodedQuery());
		rec.query();
		while (rec.next()){
			this.dbg.FRUDebug('getCIBusinessOwners: Adding Business Owner for  ' + rec.cmdb_ci_service.getDisplayValue() + ' as ' +
			rec.cmdb_ci_service.owned_by.getDisplayValue());
			if(JSUtil.notNil(rec.cmdb_ci_service.owned_by)){
				answer.push(String(rec.cmdb_ci_service.owned_by.sys_id));
			}
		}
		this.dbg.FRUDebug('getCIBusinessOwners: Returning answer  ' + answer.join(','));
		return answer;
		
	},
	getCITechnicalOwners: function(_current){
		//get Affected CI Technical Owners (Managed By)
		this.dbg.FRUDebug('getCITechnicalOwners: Getting list of Technical Owners for Impacted Service CIs in change ' + _current.number);
		var answer = [];
		//get CIs from Affected Service CI table
		var rec = new GlideRecord('task_cmdb_ci_service');
		rec.addQuery('task', _current.sys_id);
		//rec.addQuery('cmdb_ci_service', _current.business_service);
		this.dbg.FRUDebug('getCIBusinessOwners: Executing query ' + rec.getEncodedQuery());
		rec.query();
		while (rec.next()){
			this.dbg.FRUDebug('getCIBusinessOwners: Adding Business Owner for  ' + rec.cmdb_ci_service.getDisplayValue() + ' as ' +
			rec.cmdb_ci_service.managed_by.getDisplayValue());
			if(JSUtil.notNil(rec.cmdb_ci_service.owned_by)){
				answer.push(String(rec.cmdb_ci_service.managed_by.sys_id));
			}
		}
		this.dbg.FRUDebug('getCIBusinessOwners: Returning answer  ' + answer.join(','));
		return answer;
		
	},
	
	type: 'FRUChangeUtils'
};