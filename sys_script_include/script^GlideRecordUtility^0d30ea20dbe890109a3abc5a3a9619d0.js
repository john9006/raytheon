
//Glide Ajax Server JSON
var GlideRecordUtility = Class.create();
GlideRecordUtility.prototype = Object.extendsObject(AbstractAjaxProcessor, {
getRecord : function() {
var dataObject = "[ ";
try {
  // Parameters
  // table: glide table such as 'incident'
  // qry: glide record encoded query such as 'stateIN2,3'
  // fieldlist: list of table fields separated by commas
  //               such as 'number,short_description,assigned_to'
  var table = this.getParameter("sysparm_table");
  var qry = this.getParameter("sysparm_qry");
  var fieldlist = this.getParameter("sysparm_fieldlist");

  var gr = new GlideRecord(table);
  // if table is valid, execute the glide record query
  // else prepare invalid table error message
  if (gr.isValid()) {
    gr.addEncodedQuery(qry);
    gr.query();

    // if query returns no records, prepare no records found message
    if (gr.getRowCount() == 0) {
      dataObject += '"error" : "GlideRecordUtility No Records Found For Table "' + table + " Query " + qry + '"';
    } else {
      // while records exist in the query
      while (gr.next()) {
        // prepare start record and get record fields
        dataObject += "{ ";
        var fields = gr.getFields();

        // for each field in the record
        for (var i = 0; i < fields.size(); i++) {
          var glideElement = fields.get(i);
          var descriptor = glideElement.getED();
          var type = descriptor.getInternalType();
          var choice = descriptor.choice;
          var name = glideElement.getName();
          // if the field contains a value
          //   and the field exists in field list parameter
          if (glideElement.hasValue() && fieldlist.indexOf(name) != -1) {
            if(type == "reference" || choice != "0"){
              val = glideElement.getDisplayValue();
            } else {
              val = val.replace(/\"/g, "");
              val = val.replace(/\/g, "");
              val = val.replace(/\//g, "");
              // remove escape characters from token
              val = val.replace(/\b|\f|\n|\r|\t|\u|\v/g,"");
            }
            // format JSON token
            dataObject += '"' + name + '" : "' + val + '" , ';
          }
        }

        // remove last comma from token and prepare end record
        dataObject = dataObject.substring(0,dataObject.lastIndexOf(","));
        dataObject += "}, ";
    }
    // remove last comma from last record
    dataObject = dataObject.substring(0,dataObject.lastIndexOf(","));
  } else {
    dataObject += '{"error" : "GlideRecordUtility: Invalid Table: ' + table + '"}';
  }
}
catch (err) {
  dataObject += '{"error" : "GlideRecordUtility: ' + err + '"}';
}
// prepare end JSON statement and return coded object
dataObject += " ]";
return new JSON().stringify(dataObject);
}
});
