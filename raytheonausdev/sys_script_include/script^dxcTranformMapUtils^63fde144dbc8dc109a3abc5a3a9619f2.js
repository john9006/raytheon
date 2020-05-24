var dxcTranformMapUtils = Class.create();
dxcTranformMapUtils.prototype = {
    initialize: function() {
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

    type: 'dxcTranformMapUtils'
};