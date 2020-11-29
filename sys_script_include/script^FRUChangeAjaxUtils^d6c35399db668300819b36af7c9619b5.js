var FRUChangeAjaxUtils = Class.create();
FRUChangeAjaxUtils.prototype = Object.extendsObject(AbstractAjaxProcessor, {
	checkPlannedStartDate: function(){
		this.dbg = new FRUDebugUtils('FRUChangeAjaxUtils');
		var start = this.getParameter('sysparm_startdate');
		var cabdate = this.getParameter('sysparm_cabdate');
		var is_new = this.getParameter('sysparm_is_new_change');
		var chgtype = this.getParameter('sysparm_chgType');
		var answer = {
		};
		
		var da = new GlideDateTime();
		da.setDisplayValue(start);
		var db = new GlideDateTime();
		db.setDisplayValue(cabdate);

		//For standard change, only check date is not before today
		if (chgtype == 'standard' || chgtype == 'minor') {
			answer = {
				message:"",
				result:'true'
			}
			if (gs.dateDiff(da.getDisplayValue(),gs.nowDateTime(),true) > 0) {
				answer = {
					message:"The Planned Start date must be after now.",
					result:'false'
				}
			}
			return JSON.stringify(answer);
		}


		//When saved, the CAB date field is not a datetime field and the default time is based on the server
		//To calculate the date diff with 11am (CAB time set by Raytheon) instead of that default time
		//we compare with the difference between 0:00:00 and 11:00:00
		//Which is 39600s
		//However, when the change is first created, the CAB date is calculated and has a correct time
		//In that exception, we need to compare the planned start date with the actual calculated CAB date
		//If you ever read this and wonder how long it took me to figure out what was the problem and how to fix it
		//Thanks for remotely sharing my pain
		if (gs.dateDiff(da.getDisplayValue(),db.getDisplayValue(),true) > -39600 && chgtype != 'expedited' && !is_new) {
			this.dbg.FRUDebug('checkPlannedStartDate: Planned Start Date before CAB date.');
			answer = {
				message:"The Planned Start date must be after the selected CAB date.",
				result:'false'
			};
		} else if (gs.dateDiff(da.getDisplayValue(),db.getDisplayValue(),true) > 0 && chgtype != 'expedited' && is_new) {
			this.dbg.FRUDebug('checkPlannedStartDate: Planned Start Date before CAB date.');
			answer = {
				message:"The Planned Start date must be after the selected CAB date.",
				result:'false'
			};
		} else {
			this.dbg.FRUDebug('checkPlannedStartDate: Checking Planned start ' + start + ' using Change Type ' + chgtype);
			if(JSUtil.notNil(start) && JSUtil.notNil(chgtype)){
				var fruChgUtils = new FRUChangeUtils();

				answer = fruChgUtils.checkChangeLeadTime(chgtype,start);
			}
		}
		this.dbg.FRUDebug('checkPlannedStartDate: returning Answer: ' + JSON.stringify(answer));
		return JSON.stringify(answer);
	},
	checkPlannedEndDate: function(){
		this.dbg = new FRUDebugUtils('FRUChangeAjaxUtils');
		var start = this.getParameter('sysparm_startdate1');
		var end = this.getParameter('sysparm_enddate1');
		//var chgtype = this.getParameter('sysparm_chgType');
		var answer = { 
			"message":"",
			"result":"false"
		};
		
		this.dbg.FRUDebug('checkPlannedEndDate: Checking Planned end ' + end + ' is after start ' + start);
		if(JSUtil.notNil(start) && JSUtil.notNil(end)){
			var startgdt = new GlideDateTime();
			startgdt.setDisplayValue(start);
			var endgdt = new GlideDateTime();
			endgdt.setDisplayValue(end);
			var diff = gs.dateDiff(startgdt.getDisplayValue(),endgdt.getDisplayValue(),true);
			this.dbg.FRUDebug('checkPlannedEndDate: Difference between Start ' + startgdt.getDisplayValue() + ' and End ' + endgdt.getDisplayValue() + ' is ' + diff);
			if(diff > 0){
				answer.result = "true";
			} 
			else {
				answer.message = "Planned End date and time is before Planned start date and time";
				answer.result = "false";
			}

		}
		this.dbg.FRUDebug('checkPlannedEndDate: returning Answer: ' + JSON.stringify(answer));
		return JSON.stringify(answer);
	},
	getNextCabDate: function(){
		this.dbg = new FRUDebugUtils('FRUChangeAjaxUtils');
		var fru = new FRUChangeUtils();
		var chgtype = this.getParameter('sysparm_chgtype');
		//var start = this.getParameter('sysparm_start');
		var start = new GlideDateTime().getDisplayValue();
		this.dbg.FRUDebug('getNextCabDate: Lookup next CAB Date Using Date ' + start + ' Change Type: ' + chgtype);
		var answer = fru.getNextCABDate(chgtype,start);
		this.dbg.FRUDebug('getNextCabDate: Returning Answer ' + answer);
		return answer.getDisplayValue();

	},
	getNowDateTime: function(){
		this.dbg = new FRUDebugUtils('FRUChangeAjaxUtils');
		this.dbg.FRUDebug('getNowDateTime: Getting current date and time');
		var now = gs.nowDateTime();
		this.dbg.FRUDebug('getNowDateTime: Returning: ' + now);
		return now;
	},
	checkCABDate: function(){
		var cab_new = this.getParameter('sysparm_cab_new');
		var chgtype = this.getParameter('sysparm_chgType');

		var answer = {
			message:"",
			result:'true'
		};

		var start = new GlideDate().getDisplayValue();
		var fru = new FRUChangeUtils();
		var next_cab = fru.getNextCABDate(chgtype,start);

		var da = new GlideDate();
		da.setDisplayValue(cab_new);

		//3 = Wednesday
		if (da.getDayOfWeek() != 3) {
			this.dbg.FRUDebug('checkCABDate: CAB date must be on a Wednesday');
			answer = {
				message:"The CAB date must be on a Wednesday.",
				result:'false'
			}
		} else {

			var dd = gs.dateDiff(da.getDisplayValue(),next_cab.getDisplayValue(),true);
			if (dd > 50000) {
				this.dbg.FRUDebug('checkCABDate: New CAB date must be after default CAB date');
				answer = {
					message:"The new CAB date must be equal or after the default CAB date. ",
					result:'false'
				}
			}
		}
		return JSON.stringify(answer);
	},

	type: 'FRUChangeAjaxUtils'
});