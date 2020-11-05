var SmartAjaxReferenceLookup = Class.create();
SmartAjaxReferenceLookup.prototype = Object.extendsObject(AbstractAjaxProcessor, {
    ajaxClientDataHandler: function() {

        //Get data from the form
        var tableName = this.getParameter('sysparm_tablename');
        var sysId = this.getParameter('sysparm_sysid');
        //Handle multiple field names
        var commaSeperatedFields = this.getParameter('sysparm_fieldnames');
        var fieldNames = commaSeperatedFields.split(",");
        //Setup data to return to form
        var answer = {};

        //Do server side stuff
        answer = this.getPairValuesDisplays(tableName, sysId, fieldNames);

        //Encode data into a string to send back to the form
        return JSON.stringify(answer);

    },

    getPairValuesDisplays: function(table, sysId, fieldNames) {
        var fieldsPairValues = {}; // New Structure to contain all our field values and displays
        var gr = new GlideRecordSecure(table);

        if (gr.get(sysId)) {
            //Iterate through all our field names
            for (var f in fieldNames) {
                var fieldName = fieldNames[f];

                var value = gr.getValue(fieldName);
                if (value != null) { //Value is null if user has no read access
                    var fieldValueDisplay = {
                        value: gr.getValue(fieldName),
                        displayValue: gr.getDisplayValue(fieldName)
                    };
                    fieldsPairValues[fieldName] = fieldValueDisplay; //Add field data
                }

            }
        }

        return fieldsPairValues;

    },

    type: 'SmartAjaxReferenceLookup'
});