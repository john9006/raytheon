gs.include('PrototypeServer');
var FRUDebugUtils = Class.create();
FRUDebugUtils.prototype = {
	initialize: function(_name) {
		this.type = _name;
		
		this._log = (new global.GSLog(null, this.type)).setLog4J();
		this._log.setLevel(GSLog.TRACE);
		
		// Debug is enabled by default for dev instance names
		// To enable for non-Dev instances, add a System Property "debug.SI.<calling script name>" and set the value to true.
		// To disable debugging, set the property created above to false.
		// To use debug from another script - add "this.dbg = new FRUDebugUtils('<script name>'); into the initialize function.
		// Add a debug line "this.dbg.KSdebug('<function name>: and text to output');"
		
		// This sets debugging to true for all instances containing Dev or Test
		var debugproperty = gs.getProperty("debug.SI." + this.type,null);
		//If it is false in the property
		var dbg = false;
		//If it is false in the property
		if (debugproperty == null) {
			if (gs.getProperty("instance_name").match(/dev/i)){
				dbg = true;
			}
			else {
				dbg = false;
			}
		}
		else {
			dbg = (debugproperty == 'false') ? false : true;
		}
		
		this._debugging = dbg;
		
		
		// NOTE: Setting the property to False will NOT disable debugging on Dev instances
	},
	
	FRUDebug: function(_msg) {
		if (this._debugging) {
			var localtime = new Date();
			var ms = '000' + localtime.getMilliseconds();
			ms = ms.slice(-3);
			
			this._log.debug(this.type + ' ' + localtime.getFullYear() +
			'-' + this._padZero((localtime.getMonth() + 1), 2) + '-' +
			this._padZero(localtime.getDate(), 2) + ' ' + this._padZero(localtime.getHours(), 2) +
			':' + this._padZero(localtime.getMinutes(), 2) + ':' +
			this._padZero(localtime.getSeconds(), 2) + '.' + ms + ': ' + _msg);
		}
	},
	
	_padZero: function(num) {
		var numberString = "0" + num;
		return numberString.slice(-2);
	},
	FRUdebug: function(_msg){
		this.FRUDebug(_msg);
	},
	
	type: 'FRUDebugUtils'
};