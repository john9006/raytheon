var TimeCardProcessHandler = Class.create();
TimeCardProcessHandler.prototype = {
    initialize: function() {
    },
	
	process: function(record) {
		var timeCard = this._validRecord(record);
		var taskRateAPI = new TaskRateAPI(timeCard);
		var dailyRates = taskRateAPI.getRateForTimecard();
		
		this._updateResourceActual(timeCard, dailyRates);
		
		if(!timeCard.task.nil()) {
			var trp = new TaskRateProcessor();
			var expLine = trp.processTaskTimeCardWithDailyRate(timeCard,dailyRates);
			//update state to processed so we dont process again
			timeCard.state = "Processed";
			timeCard.update();
		}
		
	},
	
	recall: function(record) {
		var timeCard = this._validRecord(record);
		var taskRateAPI = new TaskRateAPI(timeCard);
		var dailyRates = taskRateAPI.getRateForTimecard();
		
		this._updateResourceActual(timeCard, dailyRates);
		
		if(!timeCard.task.nil()) {
			var trp = new TaskRateProcessor();
			var expLineCount = trp.recallTaskTimeCard(timeCard);
			if (parseInt(expLineCount) > 0)
				gs.addInfoMessage(gs.getMessage('{0} Expense line have been recalled', expLineCount.toString()));
		}
	},
	
	_validRecord: function(record) {
		if (record instanceof GlideRecord)
			return record;
		else
			return this.getGlideRecord(record);
	},
	
	_updateResourceActual: function(timeCard, dailyRates) {
		/**
		* Populating resource Actuals
		**/
		if (timeCard.isValidField('resource_plan')) {
			var timeSheetPolicy = TimeSheetPolicy.getFromUser(timeCard.user.getRefRecord());
			if (timeSheetPolicy.updateResourcePlan() && timeCard.total > 0) {
				var resourceActuals = new ResourceActuals(timeCard, dailyRates);
				resourceActuals.updateActualsFromTimeCard();
			} 
		}
	},
	
	getGlideRecord: function(record) {
		var gr = new GlideRecord('time_card');
		gr.get(record);
		
		return gr;
	},

    type: 'TimeCardProcessHandler'
};