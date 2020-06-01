var dxcTranformMapUtils = Class.create();
dxcTranformMapUtils.prototype = {
  initialize: function () {
    this.dbg = new FRUDebugUtils('dxcTransformMapUtils');
    },

	/**
	* Gets a List of EXIM Programs
	*
	* @param _programs {string} A list of program names seperated by semi-colons (";"). For example "LAND 19 Ph7B; AIR6500;""
	* @return {string} A comma seperated list of program sys_ids for populating a List variable
	*/
	getEXIMPrograms: function(_programs){
		var result = [];

		//LAND 19 Ph7B; AIR6500;
		if(JSUtil.notNil(_programs)){
			var list = _programs.split(';');

			for(var p = 0; p < list.length; p++){
				var prog = list[p];
				prog = prog.trim();

				//Skip empty
				if(JSUtil.notNil(prog)){
					var grPrograms = new GlideRecord('u_exim_program');
					grPrograms.addQuery('u_name', prog);
					grPrograms.query();

					if(grPrograms.next()){
						result.push(grPrograms.sys_id.toString());
					}
				}
			}
		}

		return result.join(',');
  },
  /**
	* Gets a List of EXIM Agreement sys_ids for a Glide List field
	*
	* @param _programs {string} A list of EA numbers seperated by semi-colons (";"). For example "LAND 19 Ph7B; AIR6500;""
	* @return {string} A comma seperated list of EA sys_ids for populating a List variable
	*/
  getEXIMAgreements: function(_agreements){
		var resultArray = [];
    this.dbg.FRUDebug('getEXIMAgreements: The _agreement data being passed in is ' + _agreements);
		//5568; 5569
    if (JSUtil.notNil(_agreements)) {

			var list = _agreements.split(';'); //into an array

			for(var i = 0; i < list.length; i++){
				var ea = list[i];
        ea = ea.trim(); // get rid of any spaces
        this.dbg.FRUDebug('getEXIMAgreements: THe value of ea  is ' + ea);

				//Skip empty
        if (JSUtil.notNil(ea)) {
          var grAgree = new GlideRecord('u_exim_agreement');
          grAgree.addQuery('u_ea_number', ea);
          grAgree.query();

					if(grAgree.next()){
						resultArray.push(grAgree.sys_id.toString());
					}
				}
			}
		}

		return resultArray.join(',');
	},

    type: 'dxcTranformMapUtils'
};